import React from 'react';
import { Button } from '@components';
import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  TableBody,
  ColumnProps,
  Row as AriaRow,
  RowProps,
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableHeaderProps,
  TableProps,
  useTableOptions,
  ResizableTableContainer as AriaResizableTableContainer,
  ColumnResizer as AriaColumnResizer,
} from 'react-aria-components';
import styles from './Table.module.css';
import { Checkbox } from '@components';

/**
 * Column component for Table.
 */
function Column(
  props: Omit<ColumnProps, 'children'> & { children?: React.ReactNode }
) {
  return (
    <AriaColumn className={styles.column} {...props}>
      {({ allowsSorting, sortDirection }) => (
        <>
          {props.children}
          {allowsSorting && (
            <span aria-hidden="true" className={styles.sortIndicator}>
              {sortDirection === 'ascending' ? '▲' : '▼'}
            </span>
          )}
        </>
      )}
    </AriaColumn>
  );
}

/**
 * Cell component for Table.
 */
function Cell(props: React.ComponentProps<typeof AriaCell>) {
  return <AriaCell className={styles.cell} {...props} />;
}

/**
 * TableHeader component for Table.
 */
function TableHeader<T extends object>(
  { columns, children }: TableHeaderProps<T>
) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  return (
    <AriaTableHeader className={styles.tableHeader}>
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <AriaColumn />}
      {selectionBehavior === 'toggle' && (
        <AriaColumn>
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

/**
 * Row component for Table.
 */
function Row<T extends object>(
  { id, columns, children, ...otherProps }: RowProps<T>
) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow className={styles.row} id={id} {...otherProps}>
      {allowsDragging && (
        <Cell>
          <Button slot="drag">≡</Button>
        </Cell>
      )}
      {selectionBehavior === 'toggle' && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

/**
 * Body component for Table.
 */
function Body(props: React.ComponentProps<typeof TableBody>) {
  return <TableBody className={styles.body} {...props} />;
}

/**
 * ResizableTableContainer component for Table.
 */
function ResizableTableContainer(props: React.ComponentProps<typeof AriaResizableTableContainer>) {
  return <AriaResizableTableContainer className={styles.resizableTableContainer} {...props} />;
}

/**
 * ColumnResizer component for Table.
 */
function ColumnResizer(props: React.ComponentProps<typeof AriaColumnResizer>) {
  return <AriaColumnResizer className={styles.columnResizer} {...props} />;
}

/**
 * Table component that includes TableHeader, Row, Column, Cell, Body, ResizableTableContainer, and ColumnResizer as static properties.
 */
const Table = Object.assign(
  function Table(props: TableProps) {
    return <AriaTable className={styles.table} {...props} />;
  },
  {
    Header: TableHeader,
    Row,
    Column,
    Cell,
    Body,
    ResizableTableContainer,
    ColumnResizer,
  }
);

export { Table };
