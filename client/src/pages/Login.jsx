import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/thunks/authThunks';
import { clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockOpen } from '@/components/animate-ui/icons/lock-open';


const Login = () => {
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [inputError, setInputError] = useState(null); // 'mobile' | 'password' | null
    const [focusedInput, setFocusedInput] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const errorCode = error?.code || '';
    const errorMessage = error?.message || '';

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) navigate('/chat');
    }, [isAuthenticated, navigate]);

    // 🔥 React to backend error codes
    useEffect(() => {
        if (!errorCode) return;

        if (errorCode === 'USER_NOT_FOUND') {
            setInputError('mobile');
        } else if (errorCode === 'INVALID_PASSWORD') {
            setInputError('password');
        }

        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    }, [errorCode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setInputError(null);
        dispatch(clearError());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.mobile || !formData.password) {
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 500);
            return;
        }

        dispatch(loginUser(formData));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <div className="bg-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl shadow-indigo-500/10 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-sm">Sign in to continue to ChatSphere</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mobile Number */}
                    <motion.div animate={inputError === 'mobile' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                        <label
                            className={`block text-sm font-medium mb-2 transition-colors duration-200 ${focusedInput === 'mobile' ? 'text-slate-300' : 'text-slate-400'
                                }`}
                        >
                            Mobile Number
                        </label>
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${focusedInput === 'mobile' ? 'opacity-50' : ''
                                }`}></div>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('mobile')}
                                onBlur={() => setFocusedInput(null)}

                                className={`relative w-full px-4 py-3.5 rounded-xl bg-slate-800 border ${inputError === 'mobile'
                                    ? 'border-red-500/50 ring-1 ring-red-500/50'
                                    : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                    } outline-none transition-all duration-200 text-slate-100 placeholder-slate-500`}
                                placeholder="Enter your mobile number"
                            />
                        </div>
                        {inputError === 'mobile' && (
                            <p className="text-red-400 text-xs mt-1.5 ml-1">
                                {errorMessage || 'Mobile number not found'}
                            </p>
                        )}
                    </motion.div>

                    {/* Password */}
                    <motion.div animate={inputError === 'password' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                        <label
                            className={`block text-sm font-medium mb-2 transition-colors duration-200 ${focusedInput === 'password' ? 'text-slate-300' : 'text-slate-400'
                                }`}
                        >
                            Password
                        </label>
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 ${focusedInput === 'password' ? 'opacity-50' : ''
                                }`}></div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}

                                    className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-800 border ${inputError === 'password'
                                        ? 'border-red-500/50 ring-1 ring-red-500/50'
                                        : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                        } outline-none transition-all duration-200 text-slate-100 placeholder-slate-500`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                >
                                    <LockOpen animateOnHover={true} />
                                </button>
                            </div>
                        </div>
                        {inputError === 'password' && (
                            <p className="text-red-400 text-xs mt-1.5 ml-1">
                                {errorMessage || 'Password is incorrect'}
                            </p>
                        )}
                    </motion.div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 mt-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <p className="text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
