import React, { useEffect, useRef, useState } from 'react'
import { Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

function timeAgo(ts) {
	const d = new Date(ts);
	const diff = (Date.now() - d.getTime()) / 1000;
	if (!isFinite(diff)) return '';
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
	return d.toLocaleString();
}

const Notificationbell = () => {
	// CSS to hide scrollbar across browsers for the notification list
	const hideScrollbarCSS = `
		.notificationbell-scroll {
			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */
		}
		.notificationbell-scroll::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera */
			height: 0; width: 0;
		}
	`;
	const { notifications } = useNotifications();
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const onClick = (e) => {
			if (open && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, [open]);

	useEffect(() => {
		// Close the dropdown on route change
		setOpen(false);
	}, [location.pathname]);

	const count = notifications?.length || 0;
	const recent = (notifications || []).slice(0, 6);

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Inject hiding scrollbar CSS */}
			<style>{hideScrollbarCSS}</style>
			<button onClick={() => setOpen(v => !v)} className="relative p-1 rounded hover:bg-gray-100">
				<Bell className="w-5 h-5 md:w-6 md:h-6 text-[var(--blue700)]" />
				{count > 0 && (
					<span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] text-white">
						{Math.min(count, 9)}{count > 9 ? '+' : ''}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50 scrollbar-hide">

					<div className="px-4 py-3 border-b-gray-200 border-b">
						<div className="font-semibold text-gray-800">Notifications</div>
					</div>

					<div className="max-h-96 overflow-auto notificationbell-scroll">
						{recent.length === 0 ? (
							<div className="p-4 text-sm text-gray-500">No notifications</div>
						) : (
							recent.map(n => (
								<div key={n._id} className="px-4 py-3 last:border-b-0 border-gray-500 hover:bg-gray-50">
									<div className="text-sm text-gray-800 whitespace-pre-wrap">{n.message}</div>
									<div className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</div>
								</div>
							))
						)}
					</div>

					<div className="px-3 py-2">
						<button
							onClick={() => {
								setOpen(false);
								navigate('/notifications');
							}}
							className="w-full inline-flex items-center justify-center px-3 py-2 bg-[var(--blue700)] text-white text-sm rounded-lg hover:opacity-90"
						>
							View all
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Notificationbell
