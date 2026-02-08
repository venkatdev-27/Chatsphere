import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/thunks/authThunks';
import { clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockOpen } from '@/components/animate-ui/icons/lock-open';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';

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
        <StarsBackground
            starColor="rgba(255, 255, 255, 0.3)"
            speed={200}
            className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_bottom,_#334155_0%,_#1e293b_50%,_#0f172a_100%)]"
        >
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md z-10"
            >
                <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-slate-100 mb-2">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join us and start chatting</p>
                    </div>

                    {/* Error Message */}
                    {(error || passwordError) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
                        >
                            {error || passwordError}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">Name</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-slate-100 placeholder-slate-500"
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
                                className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-slate-100 placeholder-slate-500"
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
                                className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-slate-100 placeholder-slate-500"
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
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/60 border ${passwordError
                                        ? 'border-red-500 ring-2 ring-red-500/30'
                                        : 'border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                        } outline-none transition-all duration-200 text-slate-100 placeholder-slate-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
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
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/60 border ${passwordError
                                        ? 'border-red-500 ring-2 ring-red-500/30'
                                        : 'border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                        } outline-none transition-all duration-200 text-slate-100 placeholder-slate-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                >
                                    <LockOpen animateOnHover={true} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : "Create Account"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </StarsBackground>
    );
};

export default Signup;
