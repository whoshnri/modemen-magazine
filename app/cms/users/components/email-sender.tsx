"use client";

import { useState } from "react";
import { X, Send, Paperclip, Check, Users, FileText } from "lucide-react";
import { useToast } from "@/components/toast/use-toast";

type User = {
    id: string;
    email: string;
    name: string | null;
    subscriptionPlan: string;
};

export function EmailSender({ users, label = "Send Email" }: { users: User[], label?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [activeTab, setActiveTab] = useState<'recipients' | 'compose'>('recipients');
    const { showToast } = useToast();

    // Filter mainly for subscribers or allow all
    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const toggleUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSend = async () => {
        if (selectedUsers.length === 0) {
            showToast("Please select at least one recipient.", "error");
            return;
        }
        if (!subject.trim() || !body.trim()) {
            showToast("Please provide both subject and body.", "error");
            return;
        }

        setIsSending(true);

        // Fake Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        showToast(`Email sent successfully to ${selectedUsers.length} recipients!`, "success");

        // Reset
        setIsSending(false);
        setIsOpen(false);
        setSubject("");
        setBody("");
        setSelectedUsers([]);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gold-primary text-black-primary font-bold px-4 py-3 text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors flex items-center gap-2"
            >
                <div className="w-4 h-4 rounded-full border border-black-primary flex items-center justify-center">
                    <Send className="w-2 h-2" />
                </div>
                {label}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-black-primary border border-white/10 w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-black-secondary">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase">Compose Broadcast</h2>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden flex border-b border-white/10 bg-black-secondary/50">
                    <button
                        onClick={() => setActiveTab('recipients')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'recipients'
                                ? 'bg-black-primary text-gold-primary border-b-2 border-gold-primary'
                                : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Recipients ({selectedUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'compose'
                                ? 'bg-black-primary text-gold-primary border-b-2 border-gold-primary'
                                : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Compose
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                    {/* User Selection Sidebar */}
                    <div className={`${activeTab === 'recipients' ? 'flex' : 'hidden'} md:flex w-full md:w-1/3 border-r border-white/10 flex-col bg-black-primary/50`}>
                        <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recipients ({selectedUsers.length})</span>
                            <button onClick={handleSelectAll} className="text-xs text-gold-primary hover:text-white uppercase font-bold">
                                {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className={`p-2 sm:p-3 cursor-pointer flex items-center gap-2 sm:gap-3 transition-colors border ${selectedUsers.includes(user.id)
                                        ? "bg-gold-primary/10 border-gold-primary/30"
                                        : "hover:bg-white/5 border-transparent"
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedUsers.includes(user.id) ? "bg-gold-primary border-gold-primary text-black" : "border-muted-foreground"
                                        }`}>
                                        {selectedUsers.includes(user.id) && <Check className="w-3 h-3" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs sm:text-sm font-bold truncate ${selectedUsers.includes(user.id) ? "text-white" : "text-gray-400"}`}>
                                            {user.name || "Unknown"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                                            {(user.subscriptionPlan === "PREMIUM" || user.subscriptionPlan === "VIP") && (
                                                <span className="text-[8px] bg-gold-primary text-black px-1 rounded-sm font-bold shrink-0">PRO</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compose Area */}
                    <div className={`${activeTab === 'compose' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-black-secondary/30`}>
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold-primary uppercase tracking-widest">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter email subject..."
                                    className="w-full bg-black-primary border border-white/10 p-2 sm:p-3 text-sm sm:text-base text-white focus:border-gold-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2 flex-1 flex flex-col min-h-[200px] sm:min-h-[300px]">
                                <label className="text-xs font-bold text-gold-primary uppercase tracking-widest">Message (HTML)</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="<p>Write your message here using HTML...</p>"
                                    className="w-full flex-1 bg-black-primary border border-white/10 p-2 sm:p-3 text-white font-mono text-xs sm:text-sm focus:border-gold-primary focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Attachments</label>
                                <div className="border border-dashed mt-2 border-white/20 p-4 sm:p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer group">
                                    <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 mb-2 group-hover:text-gold-primary transition-colors" />
                                    <p className="text-xs">Click to upload files (Demo Only)</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 sm:p-6 border-t border-white/10 bg-black-secondary flex justify-end">
                            <button
                                onClick={handleSend}
                                disabled={isSending}
                                className="w-full sm:w-auto bg-gold-primary text-black-primary font-bold px-6 sm:px-8 py-3 text-xs uppercase tracking-widest hover:bg-gold-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <span className="animate-spin">⟳</span> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Send Broadcast
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
