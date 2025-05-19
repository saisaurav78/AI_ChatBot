import { useEffect, useRef } from 'react'; 
import chatStore from '../store/chatStore';
import { observer } from 'mobx-react-lite';

const ChatPage = observer(() => {
  const messagesEndRef = useRef(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    await chatStore.sendMessage(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages.length]);

  return (
    <div className='flex w-full items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-xl h-[80vh] bg-blue-500 border border-gray-300 rounded-2xl shadow-xl p-2'>
        <div className='flex flex-col items-center justify-start'>
          <h1 className='text-lg font-bold text-white text-center'>AI Chat</h1>
          <p className='text-sm text-white text-center'>Talk with an AI assistant</p>
          {chatStore.typing && (
            <p className='text-sm text-white animate-pulse'>AI is typing...</p>
          )}
        </div>

        <div className='flex flex-col h-[calc(100%-6rem)] mt-12 w-full bg-white rounded-xl shadow-md p-3'>
          <div className='flex-1 overflow-y-auto rounded-lg p-3 sm:p-4 mb-3 sm:mb-4'>
            {chatStore.messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-100 ml-auto max-w-[70%]'
                    : 'bg-gray-100 mr-auto max-w-[70%]'
                }`}
              >
                <p className='text-gray-800 break-words'>{message.text} </p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-600 text-right' : 'text-gray-500'
                  }`}
                >
                  {message.sender}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <hr className='my-3 sm:my-4 border-gray-300 w-full' />
          <form className='flex items-center' onSubmit={handleFormSubmit}>
            <input
              type='text'
              placeholder='Type your message...'
              className='flex-1 p-2 sm:p-3 rounded-lg focus:outline-none'
            />
            <button
              type='submit'
              className='ml-2 bg-blue-500 text-white p-2 sm:py-2 sm:px-4 rounded-lg hover:bg-gray-600 transition duration-200'
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
