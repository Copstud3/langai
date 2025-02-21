import React from 'react'
import { ConfirmationDialog } from "./ConfirmationDialog";
import Link from 'next/link';

const Header = ({messages, showClearAllConfirmation, setShowClearAllConfirmation, handleClearAll}) => {
  return (
    <div className="flex justify-between items-center mb-3 lg:px-20 px-3">
      <Link href="/"><div className='flex flex-col'>
        <h1 className="font-bold font-inter text-2xl text-gray-600">
          LangAI
        </h1>
        <p className='text-gray-400 text-sm'>Powered by AI</p>
        </div></Link>
        {messages.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowClearAllConfirmation(true)}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <span className='px-3 py-2 bg-red-600 text-white rounded-lg shadow'>Clear All</span>
            </button>

            {showClearAllConfirmation && (
              <ConfirmationDialog
                message="Are you sure you want to delete all messages?"
                onConfirm={handleClearAll}
                onCancel={() => setShowClearAllConfirmation(false)}
              />
            )}
          </div>
        )}
      </div>
  )
}

export default Header
