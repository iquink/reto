import { FileTrigger as RACFileTrigger, FileTriggerProps } from 'react-aria-components';
import React from 'react';
import { Button } from '@components/index';


export interface FileTriggerButtonStateProps {
  /** Whether the button is currently hovered with a mouse. */
  isHovered?: boolean;
  /** Whether the button is currently in a pressed state. */
  isPressed?: boolean;
  /** Whether the button is focused, either via a mouse or keyboard. */
  isFocused?: boolean;
  /** Whether the button is keyboard focused. */
  isFocusVisible?: boolean;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Whether the button is currently in a pending state. */
  isPending?: boolean;
}

export type FileTriggerPropsWithButton = FileTriggerProps & FileTriggerButtonStateProps & {
  children: React.ReactNode;
};

/**
 * FileTrigger component styled with the design system Button.
 *
 * @param props - All props from {@link FileTriggerProps} (react-aria-components) are supported.
 *
 * Props
 * @prop acceptedFileTypes {Array<string>} Specifies what mime type of files are allowed.
 * @prop allowsMultiple {boolean} Whether multiple files can be selected.
 * @prop defaultCamera {'user' | 'environment'} Specifies the use of a media capture mechanism to capture the media on the spot.
 * @prop children {ReactNode} The children of the component (button label or content).
 * @prop acceptDirectory {boolean} Enables the selection of directories instead of individual files.
 * @prop isHovered {boolean} Whether the button is currently hovered with a mouse.
 * @prop isPressed {boolean} Whether the button is currently in a pressed state.
 * @prop isFocused {boolean} Whether the button is focused, either via a mouse or keyboard.
 * @prop isFocusVisible {boolean} Whether the button is keyboard focused.
 * @prop isDisabled {boolean} Whether the button is disabled.
 * @prop isPending {boolean} Whether the button is currently in a pending state.
 *
 * Events
 * @prop onSelect {(files: FileList | null) => void} Handler when a user selects a file.
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
  isHovered,
  isPressed,
  isFocused,
  isFocusVisible,
  isDisabled,
  isPending,
  ...props
}) => {
  return (
    <RACFileTrigger {...props}>
      <Button
        type="button"
        isHovered={isHovered}
        isPressed={isPressed}
        isFocused={isFocused}
        isFocusVisible={isFocusVisible}
        isDisabled={isDisabled}
        isPending={isPending}
      >
        {children}
      </Button>
    </RACFileTrigger>
  );
};