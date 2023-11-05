

import React, { forwardRef } from 'react';
import { ClassNames, PlateElementProps, TEditor } from '@udecode/plate-common';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export interface DraggableProps
  extends PlateElementProps,
    ClassNames<{
      /**
       * Block and gutter.
       */
      blockAndGutter: string;

      /**
       * Block.
       */
      block: string;

      /**
       * Gutter at the left side of the editor.
       * It has the height of the block
       */
      gutterLeft: string;

      /**
       * Block toolbar wrapper in the gutter left.
       * It has the height of a line of the block.
       */
      blockToolbarWrapper: string;

      /**
       * Block toolbar in the gutter.
       */
      blockToolbar: string;

      blockWrapper: string;

      /**
       * Button to dnd the block, in the block toolbar.
       */
      dragHandle: string;

      /**
       * Icon of the drag button, in the drag icon.
       */
      dragIcon: string;

      /**
       * Show a dropline above or below the block when dragging a block.
       */
      dropLine: string;
    }> {
  /**
   * Intercepts the drop handling.
   * If `false` is returned, the default drop behavior is called after.
   * If `true` is returned, the default behavior is not called.
   */
  onDropHandler?: (
    editor: TEditor,
    props: {
      nodeRef: any;
      id: string;
    }
  ) => boolean;
}

const Draggable = forwardRef<HTMLDivElement, DraggableProps>(
  ({ className, classNames = {}, onDropHandler, ...props }, ref) => {
    const { children, element } = props;

    return (
      <div
        className={cn('relative', 'opacity-50', 'group', className)}
        ref={ref}
      >
        <div
          className={cn(
            'pointer-events-none absolute top-0 flex h-full -translate-x-full cursor-text opacity-0 group-hover:opacity-100',
            classNames.gutterLeft
          )}
        >
          <div className={cn('flex h-[1.5em]', classNames.blockToolbarWrapper)}>
            <div
              className={cn(
                'pointer-events-auto mr-1 flex items-center',
                classNames.blockToolbar
              )}
            >
              <Tooltip>
                <TooltipTrigger>
                  <Icons.dragHandle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Drag to move</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className={cn('', classNames.blockWrapper)}>{children}</div>
      </div>
    );
  }
);
Draggable.displayName = 'Draggable';

export { Draggable };
