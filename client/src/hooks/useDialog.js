/**
 * @fileoverview Dialog Hook - Reusable hook for managing dialog state
 * @module hooks/useDialog
 * @description Custom React hook for managing dialog/modal open/close state
 * and associated data. Simplifies dialog state management across components.
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing dialog state
 * @hook
 * @function useDialog
 * @param {boolean} [initialOpen=false] - Initial open state
 * @param {*} [initialData=null] - Initial data associated with dialog
 * @returns {Object} Dialog state and handlers
 * @returns {boolean} return.isOpen - Whether dialog is open
 * @returns {*} return.data - Data associated with the dialog
 * @returns {Function} return.open - Opens the dialog (optionally with data)
 * @returns {Function} return.close - Closes the dialog and clears data
 * @returns {Function} return.toggle - Toggles dialog open/closed state
 * @returns {Function} return.setData - Updates dialog data without changing open state
 * @description Provides a clean interface for managing dialog state, including
 * open/close state and associated data (e.g., item being edited, confirmation details).
 * Reduces boilerplate for dialog management.
 * @example
 * const confirmDialog = useDialog();
 * 
 * // Open with data
 * confirmDialog.open({ title: 'Delete Item', itemId: '123' });
 * 
 * // In JSX
 * <Dialog open={confirmDialog.isOpen} onOpenChange={confirmDialog.toggle}>
 *   <DialogTitle>{confirmDialog.data?.title}</DialogTitle>
 * </Dialog>
 * 
 * // Close dialog
 * confirmDialog.close();
 */
export const useDialog = (initialOpen = false, initialData = null) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState(initialData);

  /**
   * Opens the dialog, optionally with associated data
   * @function open
   * @param {*} [dialogData] - Optional data to associate with the dialog
   * @returns {void}
   */
  const open = useCallback((dialogData) => {
    if (dialogData !== undefined) {
      setData(dialogData);
    }
    setIsOpen(true);
  }, []);

  /**
   * Closes the dialog and clears associated data
   * @function close
   * @returns {void}
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  /**
   * Toggles dialog open/closed state
   * @function toggle
   * @param {boolean} [forceState] - Optional state to force (overrides toggle)
   * @returns {void}
   */
  const toggle = useCallback((forceState) => {
    if (typeof forceState === 'boolean') {
      setIsOpen(forceState);
      if (!forceState) {
        setData(null);
      }
    } else {
      setIsOpen(prev => !prev);
      if (isOpen) {
        setData(null);
      }
    }
  }, [isOpen]);

  /**
   * Updates dialog data without changing open state
   * @function updateData
   * @param {*} newData - New data to associate with dialog
   * @returns {void}
   */
  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData: updateData
  };
};

/**
 * Custom hook for managing multiple related dialogs
 * @hook
 * @function useDialogs
 * @param {Array<string>} dialogNames - Names of dialogs to manage
 * @returns {Object} Object with dialog names as keys, each containing dialog state and handlers
 * @description Manages multiple dialogs simultaneously. Useful when a component
 * has several different dialogs that need to be tracked.
 * @example
 * const dialogs = useDialogs(['confirm', 'edit', 'delete']);
 * 
 * // Open specific dialog
 * dialogs.confirm.open({ message: 'Are you sure?' });
 * 
 * // Check if open
 * if (dialogs.edit.isOpen) { ... }
 * 
 * // Close dialog
 * dialogs.delete.close();
 */
export const useDialogs = (dialogNames) => {
  const dialogs = {};
  
  dialogNames.forEach(name => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dialogs[name] = useDialog();
  });
  
  return dialogs;
};

export default useDialog;

