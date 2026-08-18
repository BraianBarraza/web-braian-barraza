import {useCallback, useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import {auth, db, storage} from "../lib/firebase";

const EMPTY_FORM = {
    title: "",
    description: "",
    client: "",
    engagement: "",
    technologies: "",
    features: "",
    imageUrl: "",
    alt: "",
    demoUrl: "",
    linkLabel: "",
    githubUrl: "",
};

const AdminPanel = ({onClose}) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProjects(
                snapshot.docs.map((d) => ({id: d.id, ...d.data()}))
            );
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!formOpen) return;
        const handleEscape = (e) => {
            if (e.key === "Escape") closeForm();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [formOpen]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const closeForm = () => {
        setFormOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
    };

    const openAdd = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setImageFile(null);
        setImagePreview(null);
        setFormOpen(true);
    };

    const openEdit = (project) => {
        setForm({
            title: project.title || "",
            description: project.description || "",
            client: project.client || "",
            engagement: project.engagement || "",
            technologies: project.technologies || "",
            features: (project.features || []).join(", "),
            imageUrl: project.imageUrl || "",
            alt: project.alt || "",
            demoUrl: project.demoUrl || "",
            linkLabel: project.linkLabel || "",
            githubUrl: project.githubUrl || "",
        });
        setEditingId(project.id);
        setImageFile(null);
        setImagePreview(project.imageUrl || null);
        setFormOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async (file) => {
        const path = `projects/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return {imageUrl: url, imagePath: path};
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                title: form.title.trim(),
                description: form.description.trim(),
                client: form.client.trim() || null,
                engagement: form.engagement.trim() || null,
                technologies: form.technologies.trim(),
                features: form.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean),
                imageUrl: form.imageUrl.trim() || null,
                alt: form.alt.trim() || null,
                demoUrl: form.demoUrl.trim() || null,
                linkLabel: form.linkLabel.trim() || null,
                githubUrl: form.githubUrl.trim() || null,
            };

            if (editingId) {
                if (imageFile) {
                    const existing = projects.find((p) => p.id === editingId);
                    if (existing?.imagePath) {
                        try {
                            await deleteObject(ref(storage, existing.imagePath));
                        } catch {
                            // old image may not exist
                        }
                    }
                    const img = await uploadImage(imageFile);
                    data.imageUrl = img.imageUrl;
                    data.imagePath = img.imagePath;
                }
                await updateDoc(doc(db, "projects", editingId), data);
            } else {
                if (imageFile) {
                    const img = await uploadImage(imageFile);
                    data.imageUrl = img.imageUrl;
                    data.imagePath = img.imagePath;
                }
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, "projects"), data);
            }

            closeForm();
        } catch (err) {
            alert("Error saving project: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (project) => {
        if (!window.confirm(`Delete "${project.title}"?`)) return;
        setDeleting(project.id);

        try {
            if (project.imagePath) {
                try {
                    await deleteObject(ref(storage, project.imagePath));
                } catch {
                    // image may already be deleted
                }
            }
            await deleteDoc(doc(db, "projects", project.id));
        } catch (err) {
            alert("Error deleting project: " + err.message);
        } finally {
            setDeleting(null);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        onClose();
    };

    const updateField = useCallback(
        (field) => (e) => setForm((prev) => ({...prev, [field]: e.target.value})),
        []
    );

    return (
        <div className="fixed inset-0 z-[10002] bg-white dark:bg-gray-950 overflow-y-auto">
            {/* Header */}
            <div
                className="sticky top-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <i className="bx bx-arrow-back text-xl"></i>
                        Back to site
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Admin Panel
                    </h1>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                        <i className="bx bx-log-out"></i>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-5 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Projects ({projects.length})
                    </h2>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                    >
                        <i className="bx bx-plus"></i>
                        Add Project
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <i className="bx bx-loader-alt bx-spin text-4xl text-primary"></i>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="bx bx-folder-open text-6xl text-gray-300 dark:text-gray-700 mb-4 block"></i>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                            No projects yet
                        </p>
                        <button
                            onClick={openAdd}
                            className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                        >
                            Create your first project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-hidden"
                            >
                                {project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                        <i className="bx bx-image text-4xl text-gray-400"></i>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                        {project.technologies}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(project)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                        >
                                            <i className="bx bx-edit-alt"></i>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project)}
                                            disabled={deleting === project.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {deleting === project.id ? (
                                                <i className="bx bx-loader-alt bx-spin"></i>
                                            ) : (
                                                <i className="bx bx-trash"></i>
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {formOpen && (
                <div
                    className="fixed inset-0 z-[10003] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeForm();
                    }}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div
                            className="sticky top-0 bg-white dark:bg-gray-900 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingId ? "Edit Project" : "Add Project"}
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl"
                                >
                                    <i className="bx bx-x"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={updateField("title")}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.description}
                                    onChange={updateField("description")}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Client
                                </label>
                                <input
                                    type="text"
                                    value={form.client}
                                    onChange={updateField("client")}
                                    placeholder="ewolves® Consulting"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Engagement
                                </label>
                                <input
                                    type="text"
                                    value={form.engagement}
                                    onChange={updateField("engagement")}
                                    placeholder="Freelance Project"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Technologies
                                </label>
                                <input
                                    type="text"
                                    value={form.technologies}
                                    onChange={updateField("technologies")}
                                    placeholder="React, Tailwind, Firebase"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Features (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={form.features}
                                    onChange={updateField("features")}
                                    placeholder="Responsive UI, Dark mode, Auth"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-3 w-full h-40 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={updateField("imageUrl")}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image description
                                </label>
                                <input
                                    type="text"
                                    value={form.alt}
                                    onChange={updateField("alt")}
                                    placeholder="Accessible description of the project image"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Project URL
                                </label>
                                <input
                                    type="url"
                                    value={form.demoUrl}
                                    onChange={updateField("demoUrl")}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Project link label
                                </label>
                                <input
                                    type="text"
                                    value={form.linkLabel}
                                    onChange={updateField("linkLabel")}
                                    placeholder="View project"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    value={form.githubUrl}
                                    onChange={updateField("githubUrl")}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <i className="bx bx-loader-alt bx-spin"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
