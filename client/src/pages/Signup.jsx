import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/redux/thunks/authThunks';
import { clearError } from '@/redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockOpen } from '@/components/animate-ui/icons/lock-open';


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
    const [focusedInput, setFocusedInput] = useState(null);

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

    const inputFields = [
        { name: 'username', label: 'Name', type: 'text', placeholder: 'Enter your name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'name@company.com' },
        { name: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '+1 (555) 000-0000' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <div
                className="relative rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/50 p-6 sm:p-10 backdrop-blur-[12px] overflow-hidden bg-[#12161C]/40 sm:bg-[#12161C]/70"
            >
                {/* Top Light Reaction Gradient */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />
                {/* Header */}
                <div className="relative text-center mb-6 sm:mb-8 z-10">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">Join us and start chatting</p>
                </div>

                {/* Error Message */}
                {(error || passwordError) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 sm:mb-5 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-xs sm:text-sm"
                    >
                        {error || passwordError}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Standard Inputs */}
                    {inputFields.map((field) => (
                        <div key={field.name} className="relative group">
                            <label
                                className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 transition-colors duration-200 ${focusedInput === field.name ? 'text-gray-100' : 'text-gray-400'
                                    }`}
                            >
                                {field.label}
                            </label>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${focusedInput === field.name ? 'opacity-50' : ''
                                }`}></div>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput(field.name)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder={field.placeholder}
                                className="relative w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#12161C]/50 border border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200 text-gray-100 placeholder-gray-500 text-sm"
                            />
                        </div>
                    ))}

                    {/* Password */}
                    <motion.div
                        animate={shouldShakePass ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative group"
                    >
                        <label
                            className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 transition-colors duration-200 ${focusedInput === 'password' ? 'text-gray-100' : 'text-gray-400'
                                }`}
                        >
                            Password
                        </label>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${focusedInput === 'password' ? 'opacity-50' : ''
                            }`}></div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Create a password"
                                className={`relative w-full px-4 py-3 sm:py-3.5 pr-12 rounded-xl bg-[#12161C]/50 border ${passwordError
                                    ? 'border-red-500/50 ring-1 ring-red-500/50'
                                    : 'border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                    } outline-none transition-all duration-200 text-gray-100 placeholder-gray-500 text-sm`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                            >
                                <LockOpen animateOnHover={true} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                        animate={shouldShakePass ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative group"
                    >
                        <label
                            className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 transition-colors duration-200 ${focusedInput === 'confirmPassword' ? 'text-gray-100' : 'text-gray-400'
                                }`}
                        >
                            Confirm Password
                        </label>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${focusedInput === 'confirmPassword' ? 'opacity-50' : ''
                            }`}></div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => setFocusedInput('confirmPassword')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Re-enter password"
                                className={`relative w-full px-4 py-3 sm:py-3.5 pr-12 rounded-xl bg-[#12161C]/50 border ${passwordError
                                    ? 'border-red-500/50 ring-1 ring-red-500/50'
                                    : 'border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                    } outline-none transition-all duration-200 text-gray-100 placeholder-gray-500 text-sm`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                            >
                                <LockOpen animateOnHover={true} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-3.5 sm:py-4 mt-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/[0.08] text-center">
                    <p className="text-gray-400 text-xs sm:text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Signup;
