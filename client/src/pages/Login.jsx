import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/thunks/authThunks';
import { clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockOpen } from '@/components/animate-ui/icons/lock-open';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';

const Login = () => {
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const [inputError, setInputError] = useState(null); // 'mobile' | 'password' | null

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
        <StarsBackground
            starColor="rgba(255, 255, 255, 0.3)"
            speed={200}
            className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_bottom,_#334155_0%,_#1e293b_50%,_#0f172a_100%)]"
        >
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md z-10"
            >
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Sign in to continue to your chats</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Mobile Number */}
                        <motion.div animate={inputError === 'mobile' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                            <label className="text-sm text-slate-300 font-medium">Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 mt-2 rounded-lg bg-slate-900/60 border ${inputError === 'mobile'
                                    ? 'border-red-500 ring-2 ring-red-500/30'
                                    : 'border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                    } outline-none transition-all duration-200 text-slate-100 placeholder-slate-500`}
                                placeholder="Enter your mobile number"
                            />
                            {inputError === 'mobile' && (
                                <p className="text-red-400 text-xs mt-1.5">
                                    {errorMessage || 'Mobile number not found'}
                                </p>
                            )}
                        </motion.div>

                        {/* Password */}
                        <motion.div animate={inputError === 'password' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                            <label className="text-sm text-slate-300 font-medium">Password</label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/60 border ${inputError === 'password'
                                        ? 'border-red-500 ring-2 ring-red-500/30'
                                        : 'border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
                            {inputError === 'password' && (
                                <p className="text-red-400 text-xs mt-1.5">
                                    {errorMessage || 'Password is incorrect'}
                                </p>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </StarsBackground>
    );
};

export default Login;
