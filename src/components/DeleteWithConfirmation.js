import React, { useState } from "react";

const DeleteWithConfirmation = ({ handleDeleteitem }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Your Delete Button */}
      <button
        className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs gap-2 flex items-center hover:bg-red-600 hover:text-white transition-all"
        onClick={() => setShowConfirm(true)}
      >
        DELETE
        <i className="fa-solid fa-trash px-1" />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Are you sure?</h2>
            <p className="text-sm text-gray-600 text-center mb-5">
              This action is irreversible. Do you really want to delete?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteitem();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DeleteWithConfirmation