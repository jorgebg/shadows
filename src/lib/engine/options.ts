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

export class OptionID extends String {
  public code: Option["code"];
  public args?: Option["args"];

  static build(code: Option["code"], args?: Option["args"]): string {
    if (args === undefined || Object.keys(args).length == 0) {
      return code;
    }
    const normalizedArgs = Object.entries(args)
      .sort()
      .map(([k, v]) => [k, v.id || v]);
    const argsStr = new URLSearchParams(normalizedArgs).toString();
    return `${code}?${argsStr}`;
  }
  static parse(...optionIds: string[]) {
    const id = new OptionID(optionIds[optionIds.length - 1]);
    const [code, argStr] = id.split("?");
    id.code = code;
    id.args = new URLSearchParams(argStr);
    return id;
  }
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
  node.id ??= OptionID.build(node.code, node.args).toString();
  if (node.children) {
    node.children = new OptionTree(...node.children).setup(state, node);
  }
}

export class OptionTree<GS = any> extends Array<Option<GS>> {
  protected idMap: {
    [key: string]: Option<GS>;
  } = {};

  constructor(...arrayArgs: any[]) {
    super(...arrayArgs);
  }
  setup(state: SimpleState<GS>, parent?: Option<GS>) {
    for (const node of this) {
      if (parent?.args) {
        node.args = { ...(node.args || {}), ...parent.args };
      }
      node.parent = parent;
      (node.setup || defaultSetup)<GS>(state, node);
      this.idMap[node.id] = node;
    }
    return this;
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
    children: [{ ...option, code: `confirm_${code}` }],
    get description() {
      return this.children[0].description;
    },
    get disabled() {
      return this.children[0].disabled;
    },
  };
}
