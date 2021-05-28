import { useState } from 'react';
import { useAuthState } from '../../contexts/auth';
import { useMutation } from '@apollo/client';
import { REACT_TO_MESSAGE } from '../../queries';
import moment from 'moment';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

const Tooltip = ({ message, pos }) => (
	<div className={`tooltip-item tooltip-item--${pos}`}>
		<div className="tooltip-item__arrow"></div>
		<div className="tooltip-item__inner">
			{moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
		</div>
	</div>
);

export default function Message({ message }) {
	const [showTooltip, setShowTooltip] = useState(false);
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const bgClass = sent ? 'bg-primary' : 'bg-secondary';
	const marginClass = sent ? 'ml-auto' : 'mr-auto';
	const textClass = sent ? 'text-white' : '';
	const tooltipPos = sent ? 'left' : 'right';
	const [showPopover, setShowPopover] = useState(false);

	const reactionIcons = [...new Set(message.reactions.map(r => r.content))];

	const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
		onError: error => console.log(error),
		onCompleted: data => setShowPopover(false)
	});

	const react = reaction => {
		reactToMessage({
			variables: { uuid: message.uuid, content: reaction }
		});
	};

	const reactButton = (
		<OverlayTrigger
			trigger="click"
			placement="top"
			show={showPopover}
			onToggle={setShowPopover}
			transition={false}
			rootClose
			overlay={
				<Popover className="rounded-pill">
					<Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
						{reactions.map(reaction => (
							<Button
								variant="link"
								className="react-icon-button"
								key={reaction}
								onClick={() => react(reaction)}
							>
								{reaction}
							</Button>
						))}
					</Popover.Content>
				</Popover>
			}
		>
			<Button variant="link" className="px-2">
				<i className="far fa-smile"></i>
			</Button>
		</OverlayTrigger>
	);

	const handleHover = () => {
		setShowTooltip(!showTooltip);
	};

	return (
		<div className={`d-flex my-3 ${marginClass}`}>
			{sent && reactButton}
			<div
				className={`d-flex`}
				onMouseOver={() => handleHover()}
				onMouseOut={() => handleHover()}
			>
				{tooltipPos === 'left' && showTooltip && (
					<Tooltip message={message} pos={tooltipPos} />
				)}
				<div
					className={`py-2 px-3 rounded-pill position-relative ${bgClass}`}
				>
					{message.reactions.length > 0 && (
						<div className="reactions-div bg-secondary p-1 rounded-pill">
							{reactionIcons} {message.reactions.length}
						</div>
					)}
					<p className={textClass}>{message.content}</p>
				</div>
				{tooltipPos === 'right' && showTooltip && (
					<Tooltip message={message} pos={tooltipPos} />
				)}
			</div>
			{!sent && reactButton}
		</div>
	);
}
