import React, { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, username, room}) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  
  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        username: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ' : ' + new Date(Date.now()).getMinutes()
      }
      await socket.emit('send_message', messageData)
      setMessageList(list => [...list, messageData])
    }
    setCurrentMessage('')
  }

  useEffect(() => {
    socket.on('recieve_message', data => {
      console.log(data)
      setMessageList(list => [...list, data])
    })
  }, [socket])

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {
            messageList.map(el => {
              return <div className="message" id={(username === el.username) ? 'you' : 'other'}>
                <div>
                  <div className="message-content">
                    <p>{el.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{el.time}</p>
                    <p id="author"> {el.username}</p>
                  </div>
                </div>
              </div>
            })
          }
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          placeholer="Write a Message..."
          value={currentMessage}
          onChange={e => {setCurrentMessage(e.target.value)}}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat