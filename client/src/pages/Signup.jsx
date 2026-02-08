import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/thunks/authThunks';
import { clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockOpen } from '../components/animate-ui/icons/lock-open';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [shouldShakeBtn, setShouldShakeBtn] = useState(false);
    const [shouldShakePass, setShouldShakePass] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation check
        if (!formData.username || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
            setShouldShakeBtn(true);
            setTimeout(() => setShouldShakeBtn(false), 500);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            setShouldShakePass(true);
            setTimeout(() => setShouldShakePass(false), 500);
            return;
        }

        dispatch(signupUser(formData));
    };

    return (
        <div className="auth-scroll h-[100dvh] bg-slate-900 text-slate-200">
            <div className="min-h-full px-4 py-8 pb-32 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold mb-2 text-white">Join ChatSphere</h1>
                            <p className="text-slate-400">Create your free account today.</p>
                        </div>

                        {(error || passwordError) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error || passwordError}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-white placeholder-slate-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-white placeholder-slate-500"
                                />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-white placeholder-slate-500"
                                />
                            </div>

                            {/* Password */}
                            <motion.div
                                animate={shouldShakePass ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border ${passwordError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all duration-200 text-white placeholder-slate-500`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                    >
                                        <LockOpen animateOnHover={true} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div
                                animate={shouldShakePass ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border ${passwordError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} outline-none transition-all duration-200 text-white placeholder-slate-500`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                    >
                                        <LockOpen animateOnHover={true} />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                animate={shouldShakeBtn ? { x: [-10, 10, -10, 10, 0] } : {}}
                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg mt-6 ${loading ? 'bg-blue-600/50 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Creating account...
                                    </span>
                                ) : "Create Account"}
                            </motion.button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                            <p className="text-slate-400 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
