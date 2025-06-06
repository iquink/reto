import { FileTrigger as RACFileTrigger, FileTriggerProps } from 'react-aria-components';
import React from 'react';
import { Button, ButtonProps } from '@components/index';

export type FileTriggerPropsWithButton = FileTriggerProps & ButtonProps & {
  children: React.ReactNode;
};

/**
 * FileTrigger component styled with the design system Button.
 *
 * @param props - All props from {@link FileTriggerProps} (react-aria-components) are supported.
 *
 * @returns File input trigger styled as a Button
 *
 * @example
 * // Basic usage
 * <FileTrigger onSelect={files => console.log(files)}>
 *   Select a file
 * </FileTrigger>
 *
 * @example
 * // With file name display
 * const [file, setFile] = React.useState<string[] | null>(null);
 * <FileTrigger onSelect={e => {
 *   const files = e ? Array.from(e) : [];
 *   setFile(files.map(f => f.name));
 * }}>
 *   Upload
 * </FileTrigger>
 * {file && file.join(', ')}
 */
export const FileTrigger: React.FC<FileTriggerPropsWithButton> = ({
  children,
  isDisabled,
  isPending,
  ...props
}) => {
  return (
    <RACFileTrigger {...props}>
      <Button
        type="button"
        isDisabled={isDisabled}
        isPending={isPending}
      >
        {children}
      </Button>
    </RACFileTrigger>
  );
};