import chatStore from '../store/chatStore';
import { observer } from 'mobx-react-lite';

const ChatPage = observer(() => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const message = input.value;
    if (message.trim()) {
        chatStore.addMessage({ text: message, sender: 'user' });
        chatStore.setLoading(true);
        setTimeout(() => {  
            chatStore.addMessage({ text: "I'm just a bot, but I'm here to help!", sender: 'AI' });
            chatStore.setLoading(false);
        }, 1000);
      input.value = ''; 
    }
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-xl h-[80vh] bg-blue-500 border border-gray-300 rounded-2xl shadow-xl p-4 sm:p-6'>
        <div className='flex flex-col items-center justify-self-start mb-4'>
          <h1 className='text-lg font-bold text-white text-center'>AI Chat</h1>
          <p className='text-sm text-white text-center'>Talk to the AI</p>
        </div>

        <div className='flex flex-col h-[calc(100%-6rem)] mt-8 sm:mt-12 w-full bg-white rounded-xl shadow-md p-3 sm:p-4'>
          <div className='flex-1 overflow-y-auto rounded-lg p-3 sm:p-4 mb-3 sm:mb-4'>
            {chatStore.loading ? (
              <div className='flex items-center justify-center h-full'>
                <svg
                  className='animate-spin h-5 w-5 text-blue-500'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='none'
                    d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.5 15h-3v-3h3v3zm0-4.5h-3V7h3v5.5z'
                  />
                </svg>
              </div>
            ) : (
              chatStore.messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-100 ml-auto max-w-[70%]'
                      : 'bg-gray-100 mr-auto max-w-[70%]'
                  }`}
                >
                  <p className='text-gray-800 break-words'>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-600 text-right' : 'text-gray-500'
                    }`}
                  >
                    {message.sender}
                  </p>
                </div>
              ))
            )}
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
