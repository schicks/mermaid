import type { CstNode, GrammarAST, ValueType } from 'langium';

import { AbstractMermaidValueConverter } from '../common/index.js';

export class EventModelingValueConverter extends AbstractMermaidValueConverter {
  protected runCustomConverter(
    rule: GrammarAST.AbstractRule,
    input: string,
    _cstNode: CstNode
  ): ValueType | undefined {
    if (rule.name === 'EM_TITLE') {
      return input.replace(/[[\]]/g, '').trim();
    } else if (rule.name === 'EM_DATA') {
      return input.replace(/[()]/g, '').trim();
    }
    return undefined;
  }
}
