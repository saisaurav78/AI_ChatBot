import { useEffect, useRef, useState } from 'react';
import chatStore from '../store/chatStore';
import authStore from '../store/authStore';
import { observer } from 'mobx-react-lite';

const ChatPage = observer(() => {
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    chatStore.loadChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages.length]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="text"]');
    const message = input.value.trim();
    if (!message && !file) return;
    input.value = '';
    await chatStore.sendMessage({ content: message, file });
    setFile(null);
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-xl h-[80vh] bg-blue-500 border border-gray-300 rounded-2xl shadow-xl p-2 relative'>
        {/* Logout Button */}
        <button
          className='absolute top-2 right-2 p-1 text-white hover:text-gray-200 transition cursor-pointer'
          title='Logout'
          onClick={() => confirm('Are you sure you want to logout?') && authStore.logout()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
            />
          </svg>
        </button>

        {/* Header */}
        <div className='flex flex-col items-center justify-start h-12'>
          <h1 className='text-lg font-bold text-white text-center'>AI Chat</h1>
          <p className='text-sm text-white text-center'>Talk with an AI assistant</p>
          {chatStore.typing && <p className='text-sm text-white animate-pulse'>AI is typing...</p>}
        </div>

        {/* Chat Messages Area */}
        <div className='flex flex-col h-[calc(100%-6rem)] mt-12 w-full bg-white rounded-xl shadow-md p-3'>
          <div className='flex-1 overflow-y-auto rounded-lg p-3 sm:p-4 mb-3 sm:mb-4'>
            {chatStore.loading ? (
              <p className='text-sm text-center text-gray-500'>Loading...</p>
            ) : (
              chatStore.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 ml-auto max-w-[70%]'
                      : 'bg-gray-100 mr-auto max-w-[70%]'
                  }`}
                >
                  <p className='text-gray-800 break-words whitespace-pre-wrap'>{msg.text}</p>
                  <div className='text-xs mt-1 text-right'>
                    <span
                      className={`${msg.sender === 'user' ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                      {msg.sender}
                    </span>
                    {msg.time && <span className='ml-2 text-gray-400'>{msg.time}</span>}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <hr className='my-3 sm:my-4 border-gray-300 w-full' />

          {/* Input Area */}
          <form className='flex items-center gap-2 sm:gap-3' onSubmit={handleFormSubmit}>
            <input
              type='text'
              placeholder='Type your message...'
              className='flex-1 p-2 sm:p-3 rounded-lg focus:outline-none text-sm sm:text-base min-w-0'
            />

            {/* File Upload */}
            <label
              htmlFor='file'
              className='cursor-pointer p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1'
              title={file ? file.name : 'upload file'}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 sm:w-6 sm:h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'
                />
              </svg>
              <input
                type='file'
                id='file'
                title={file ? file.name : 'upload file'}
                name='file'
                hidden
                accept='.txt,.pdf'
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <span className='text-xs text-gray-700 truncate max-w-[100px]'>{file.name}</span>
              )}
            </label>

            {/* Send Button */}
            <button
              type='submit'
              className='bg-blue-500 text-white p-1.5 sm:p-2 ml-1 sm:ml-2 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0'
              aria-label='Send message'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 sm:w-6 sm:h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default ChatPage;
