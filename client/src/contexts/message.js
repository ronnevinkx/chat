import { createContext, useReducer, useContext } from 'react';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
	let users, userIndex;
	const { username, message, messages, reaction } = action.payload;

	switch (action.type) {
		case 'SET_USERS': {
			return { ...state, users: action.payload };
		}

		case 'SET_USER_MESSAGES': {
			users = [...state.users];
			userIndex = users.findIndex(user => user.username === username);
			users[userIndex].messages = messages;
			return { ...state, users };
		}

		case 'SET_SELECTED_USER': {
			users = state.users.map(user => ({
				...user,
				selected: user.username === action.payload
			}));
			return { ...state, users };
		}

		case 'ADD_MESSAGE': {
			users = [...state.users];
			userIndex = users.findIndex(user => user.username === username);
			message.reactions = [];

			let user = {
				...users[userIndex],
				messages: users[userIndex].messages ? [message, ...users[userIndex].messages] : null,
				latestMessage: message
			};

			users[userIndex] = user;

			return { ...state, users };
		}

		case 'ADD_REACTION': {
			users = [...state.users];
			userIndex = users.findIndex(user => user.username === username);

			let userCopy = { ...users[userIndex] };
			const messageIndex = userCopy.messages?.findIndex(message => message.uuid === reaction.message.uuid);

			if (messageIndex > -1) {
				let messagesCopy = [...userCopy.messages];
				let reactionsCopy = [...messagesCopy[messageIndex].reactions];

				const reactionIndex = reactionsCopy.findIndex(r => r.uuid === reaction.uuid);

				if (reactionIndex > -1) {
					// reaction exists, update it
					reactionsCopy[reactionIndex] = reaction;
				} else {
					// new reaction, add it
					reactionsCopy = [...reactionsCopy, reaction];
				}

				messagesCopy[messageIndex] = {
					...messagesCopy[messageIndex],
					reactions: reactionsCopy
				};

				userCopy = { ...userCopy, messages: messagesCopy };
				users[userIndex] = userCopy;
			}

			return { ...state, users };
		}

		default: {
			throw new Error(`Unkown action type: ${action.type}`);
		}
	}
};

export const MessageProvider = ({ children }) => {
	const [state, dispatch] = useReducer(messageReducer, { users: null });

	return (
		<MessageDispatchContext.Provider value={dispatch}>
			<MessageStateContext.Provider value={state}>{children}</MessageStateContext.Provider>
		</MessageDispatchContext.Provider>
	);
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
