import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import type { SvelteComponent } from "svelte";
import type { Icon } from "./icons";
import type { Move } from "./moves";
import type { SimpleState } from "./state";
import { assignDefaults } from "./utils/object";
import { titleize } from "./utils/string";

export interface Option<GS = any> {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  hidden?: boolean;
  help?: string;
  header?: string;
  move?: typeof Move<GS>;
  args?: Move<GS>["args"];
  component?: typeof SvelteComponent;
  icon?: Icon;
  disabled?: boolean;
  apply?: (client: _ClientImpl) => void;
  back?: number;
  parent?: Option<GS>;
  children?: Option<GS>[] | OptionTree<GS>;
  level?: number;
  breadcrumbs?: Option<GS>[];
  setup?: <GS>(state: SimpleState<GS>, option: Option<GS>) => void;
}

export function defaultSetup<GS = any>(
  state: SimpleState<GS>,
  node: Option<GS>,
) {
  node.level ??= node.parent?.level + 1 || 0;
  if (node.move) {
    const move = new node.move(node.args);
    assignDefaults(node, move.option(state));
  }
  node.code ??= `level_${node.level}`;
  node.name ??= titleize(node.code.replaceAll(/[-_]+/gi, " ").toLowerCase());

  if (node.id === undefined) {
    node.id = node.code;
    if (node.args) {
      node.id += "?";
      node.id += Object.entries(node.args)
        .map(([name, arg]) => `${name}=${arg.id || arg}`)
        .join("&");
    }
  }
  if (typeof node.icon === "string") {
    node.icon = { name: node.icon };
  }
  if (node.children) {
    const children = new OptionTree(...node.children);
    node.children = children;
    if (node.args) {
      for (const child of children) {
        child.args = { ...(child.args || {}), ...node.args };
      }
    }
    children.setup(state, node);
  }
}

export class OptionTree<GS = any> extends Array<Option<GS>> {
  protected idMap: {
    [key: string]: Option<GS>;
  } = {};

  constructor(...args: any[]) {
    super(...args);
  }
  setup(state: SimpleState<GS>, parent?: Option<GS>) {
    for (const node of this) {
      node.parent = parent;
      (node.setup || defaultSetup)<GS>(state, node);
      this.idMap[node.id] = node;
    }
  }
  getById(id: string) {
    return this.idMap[id];
  }

  path(ids: string[]): Option<GS> {
    let tree: OptionTree<GS> = this;
    let node: Option<GS>;
    let breadcrumbs = [];
    if (tree.length > 0) {
      for (const id of ids) {
        node = tree.getById(id);
        if (!node) {
          return undefined;
        }
        breadcrumbs.push(node);
        node.breadcrumbs = breadcrumbs;
        tree = node.children as OptionTree;
      }
    }
    return node;
  }

  getLeaves(
    nodes: Option<GS>[] = this,
    leaves: Option<GS>[] = [],
  ): Option<GS>[] {
    for (var i = 0, length = nodes.length; i < length; i++) {
      if (!nodes[i].children || nodes[i].children.length === 0) {
        leaves.push(nodes[i]);
      } else {
        leaves = this.getLeaves(nodes[i].children, leaves);
      }
    }
    return leaves;
  }
}

export function confirm(option: Option): Option {
  const { code, icon } = option;
  const header = "Are you sure?";
  return {
    code,
    icon,
    header,
    children: [{ ...option, name: `Confirm ${name}` }],
    get description() {
      return this.children[0].description;
    },
    get disabled() {
      return this.children[0].disabled;
    },
  };
}
