import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			console.log("reporting from search " , query);
		  const res = await axios.get(`/search?q=${query}`);
		    console.log(res.data);
		  setResults(res.data);
		} 
		catch (error) {
		  console.error("Error searching users:", error);
		}
	  };

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className='  bg-white shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					
					<div className='flex items-center space-x-4 '>
						<Link to='/'>
							<img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
						</Link>

						{/* // to-do implement search user  */}

						{authUser ? (
							<form onSubmit={handleSearch} className=" relative border rounded-md ">
						    <input
								type="text"
								placeholder="Search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full p-2 rounded-md bg-gray-100 hover:bg-gray-200"
							/> 
								{results.length > 0 && (
									<div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md z-10">
										{/* {results.map((user) => (
										<div key={user._id} className="p-2 flex items-center hover:bg-gray-100">
											<img
											src={user.profilePicture || "/default-profile.png"}
											alt={user.username}
											className="h-8 w-8 rounded-full mr-2"
											/>
											<div>
											<p className="font-semibold">{user.name}</p>
											<p className="text-sm text-gray-600">{user.username}</p>
											</div>
										</div>
										))} */}
									</div>
									)}
					        </form> 
							) :<></>}

					</div>
					 

					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<Home size={20} />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
     
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<Users size={20} />
									<span className='text-xs hidden md:block'>My Network</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>

								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>

								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'>
									<User size={20} />
									<span className='text-xs hidden md:block'>Me</span>
								</Link>

								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()} >
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className=' text-xl btn btn-ghost'>
									Sign In
								</Link>

								<Link to='/signup' className=' text-xl btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
