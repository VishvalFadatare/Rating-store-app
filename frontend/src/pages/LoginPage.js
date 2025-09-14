import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await login(email, password);

        if (response.success) {
            // Redirect to the correct dashboard based on the user's role
            switch (response.role) {
                case 'system_administrator':
                    navigate('/admin');
                    break;
                case 'normal_user':
                    navigate('/user-dashboard');
                    break;
                case 'store_owner':
                    navigate('/owner-dashboard');
                    break;
                default:
                    // Fallback in case of an unexpected role
                    navigate('/');
            }
        } else {
            alert(response.error);
        }
    };

//     return (

        
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//             backgroundColor: '#f0f2f5'
//         }}>
//             <div style={{
//                 padding: '40px',
//                 backgroundColor: 'white',
//                 borderRadius: '8px',
//                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 width: '300px',
//                 textAlign: 'center'
//             }}>
//                 <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Email"
//                         required
//                         style={{
//                             width: 'calc(100% - 20px)',
//                             padding: '10px',
//                             margin: '10px 0',
//                             border: '1px solid #ccc',
//                             borderRadius: '4px'
//                         }}
//                     />
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Password"
//                         required
//                         style={{
//                             width: 'calc(100% - 20px)',
//                             padding: '10px',
//                             margin: '10px 0',
//                             border: '1px solid #ccc',
//                             borderRadius: '4px'
//                         }}
//                     />
//                     <button
//                         type="submit"
//                         style={{
//                             width: '100%',
//                             padding: '10px',
//                             backgroundColor: '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer',
//                             marginTop: '10px'
//                         }}
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <p style={{ marginTop: '20px' }}>
//                     Don't have an account? <Link to="/signup">Sign Up</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Title Bar */}
            <div style={{
                backgroundColor: "#007bff",
                color: "black",
                padding: "20px",
                textAlign: "left",
                fontSize: "22px",
                fontWeight: "bold"
            }}>
                Store Rating Application
            </div>

            {/* Login Box */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f2f5'
            }}>
                <div style={{
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    width: '300px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            style={{
                                width: 'calc(100% - 20px)',
                                padding: '10px',
                                margin: '10px 0',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            style={{
                                width: 'calc(100% - 20px)',
                                padding: '10px',
                                margin: '10px 0',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Login
                        </button>
                    </form>
                    <p style={{ marginTop: '20px' }}>
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;