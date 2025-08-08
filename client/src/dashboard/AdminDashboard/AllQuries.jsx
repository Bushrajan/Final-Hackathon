import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx'; // Update path if needed
import apiAdminAnsHandle from '../../config/apiAdminAnsHandle.js';

const AllQuries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const { user } = useAuthContext(); // ✅ Get name, email, dp

    useEffect(() => {
        const fetchAllQueries = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await apiAdminAnsHandle.get('/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQueries(res.data.data || []);
            } catch (err) {
                setQueries([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllQueries();
    }, []);

    const handleAnswerClick = (question) => {
        setSelectedQuestion(question);
        setAnswerText('');
        setModalOpen(true);
    };

    const handleSubmitAnswer = async () => {
        if (!answerText.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await apiAdminAnsHandle.post(
                `/answers/${selectedQuestion._id}`,
                { answerText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Update answer in local state (no refresh needed)
            const updated = queries.map((q) =>
                q._id === selectedQuestion._id
                    ? { ...q, answer: res.data.data }
                    : q
            );
            setQueries(updated);
            setModalOpen(false);
        } catch (err) {
            console.error('Failed to submit answer:', err);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Recent Queries</h2>

                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : queries.length === 0 ? (
                        <p className="text-gray-600 text-center">No queries found.</p>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {queries.map((q) => {
                                const hasAnswer = !!q.answer?.answerText;

                                return (
                                    <div key={q._id} className="card2 bg-white p-4 rounded shadow min-w-[300px]">
                                        {/* ✅ Show who asked the question */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={q.user?.dp || q.userId?.dp || '/user.avif'}
                                                alt="User DP"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {q.user?.name || q.userId?.name || 'ADMIN'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {q.user?.email || q.userId?.email || 'admin@gmail.com'}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900">{q.title}</h3>
                                        <p className="text-sm text-gray-700">{q.description}</p>

                                        <div className="mt-2">
                                            {hasAnswer ? (
                                                <>
                                                    <span className="text-green-700 font-semibold">Answer:</span>
                                                    <p className="text-sm text-gray-800 mt-1">{q.answer.answerText}</p>
                                                    <span className="text-green-700 font-semibold block mt-1">
                                                        Status: Complete
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-yellow-700 font-semibold">Status: Pending</span>
                                            )}
                                        </div>

                                        <div className="text-end mt-3">
                                            <button
                                                onClick={() => handleAnswerClick(q)}
                                                className={`px-4 py-2 rounded transition ${hasAnswer
                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                                disabled={hasAnswer}
                                            >
                                                Answer Question...
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                        {/* ✅ Admin Info from AuthContext */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user?.dp || '/default-avatar.png'}
                                alt="Admin DP"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2">Answer the Question</h3>
                        <p className="font-semibold">{selectedQuestion?.title}</p>
                        <p className="text-sm text-gray-700 mb-4">{selectedQuestion?.description}</p>

                        <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="w-full h-32 p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Type your answer here..."
                        ></textarea>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllQuries;
