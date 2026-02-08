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
        <div className="auth-scroll h-[100dvh] bg-slate-900 text-slate-200">
            <div className="min-h-full px-4 py-8 pb-32 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">

                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-white">ChatSphere</h1>
                            <p className="text-slate-400">Welcome back! Please sign in.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Mobile */}
                            <motion.div animate={inputError === 'mobile' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                                <label className="text-sm text-slate-300">Mobile Number</label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 mt-2 rounded-lg bg-slate-900 border ${inputError === 'mobile'
                                        ? 'border-red-500 ring-2 ring-red-500/30'
                                        : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                        } outline-none transition-all duration-200 text-white placeholder-slate-500`}
                                    placeholder="Enter your mobile number"
                                />
                                {inputError === 'mobile' && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errorMessage || 'User not found'}
                                    </p>
                                )}

                            </motion.div>

                            {/* Password */}
                            <motion.div animate={inputError === 'password' && shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}>
                                <label className="text-sm text-slate-300">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 mt-2 pr-10 rounded-lg bg-slate-900 border ${inputError === 'password'
                                            ? 'border-red-500 ring-2 ring-red-500/30'
                                            : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                            } outline-none transition-all duration-200 text-white placeholder-slate-500`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 translate-y-1 text-slate-500 hover:text-white transition-colors p-1"
                                    >
                                        <LockOpen animateOnHover={true} />
                                    </button>
                                </div>
                                {inputError === 'password' && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errorMessage || 'Password is incorrect'}
                                    </p>
                                )}
                            </motion.div>

                            {/* Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                animate={shouldShake && (!formData.mobile || !formData.password) ? { x: [-10, 10, -10, 10, 0] } : {}}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg"
                            >
                                {loading ? 'Signing in…' : 'Sign In'}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                Don’t have an account?{' '}
                                <Link to="/signup" className="text-blue-400 hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
