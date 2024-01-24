import * as React from 'react';
import { useQueryBuilderSchema, useQueryBuilderSetup } from '../hooks';
import type {
  Combinator,
  Field,
  Operator,
  Path,
  QueryBuilderProps,
  RuleGroupTypeAny,
  ToFlexibleOption,
} from '../types';
import { QueryBuilderContext } from './QueryBuilderContext';

/**
 * The {@link Path} of the root group.
 */
export const rootPath = [] satisfies Path;

/**
 * Context provider for the `{@link QueryBuilder}` state store.
 */
export const QueryBuilderStateProvider = ({ children }: { children: React.ReactNode }) => ({
  children,
});

const QueryBuilderInternal = <
  RG extends RuleGroupTypeAny,
  F extends ToFlexibleOption<Field>,
  O extends ToFlexibleOption<Operator>,
  C extends ToFlexibleOption<Combinator>,
>({
  setup,
  props,
}: {
  props: QueryBuilderProps<RG, F, O, C>;
  setup: ReturnType<typeof useQueryBuilderSetup<RG, F, O, C>>;
}) => {
  const qb = useQueryBuilderSchema(props, setup);

  const RuleGroupControlElement = qb.schema.controls.ruleGroup;

  return (
    <QueryBuilderContext.Provider key={qb.dndEnabledAttr} value={qb.rqbContext}>
      <div
        role="form"
        className={qb.wrapperClassName}
        data-dnd={qb.dndEnabledAttr}
        data-inlinecombinators={qb.inlineCombinatorsAttr}>
        <RuleGroupControlElement
          translations={qb.translations}
          ruleGroup={qb.rootGroup}
          rules={qb.rootGroup.rules}
          {...qb.combinatorPropObject}
          not={!!qb.rootGroup.not}
          schema={qb.schema}
          actions={qb.actions}
          id={qb.rootGroup.id}
          path={rootPath}
          disabled={qb.rootGroupDisabled}
          shiftUpDisabled
          shiftDownDisabled
          parentDisabled={qb.queryDisabled}
          context={qb.context}
        />
      </div>
    </QueryBuilderContext.Provider>
  );
};

/**
 * The query builder component for React.
 *
 * See https://react-querybuilder.js.org/ for demos and documentation.
 */
export const QueryBuilder = <
  RG extends RuleGroupTypeAny,
  F extends ToFlexibleOption<Field>,
  O extends ToFlexibleOption<Operator>,
  C extends ToFlexibleOption<Combinator>,
>(
  props: QueryBuilderProps<RG, F, O, C>
) => {
  const setup = useQueryBuilderSetup(props);

  return <QueryBuilderInternal props={props} setup={setup} />;
};

QueryBuilder.displayName = 'QueryBuilder';
