export const ConfirmationDialog = ({ onConfirm, onCancel, message }) => (
  <div className="fixed max-sm:left-[18%] xl:right-[730px] top-20 bg-white rounded-lg shadow-lg p-3 z-10 border border-gray-200 w-64">
    <p className="text-sm text-gray-700 mb-3">{message}</p>
    <div className="flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
);
