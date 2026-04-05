'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateExpertPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, avatar: '' }),
      });

      if (res.ok) {
        const expert = await res.json();
        router.push(`/expert/${expert.id}`);
      } else {
        alert('Failed to create expert');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create expert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        ← Back to experts
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Create New Expert</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">
              Expert Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="e.g., Python Guru, Legal Advisor, History buff"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="bio" className="label">
              Bio / Description
            </label>
            <textarea
              id="bio"
              className="textarea"
              placeholder="Describe what this expert knows about..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4">
            <Link href="/" className="btn btn-secondary flex-1">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Expert'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-4 bg-[var(--secondary)] rounded-lg">
        <h3 className="font-medium mb-2">💡 Tips</h3>
        <ul className="text-sm text-[var(--muted-foreground)] space-y-1">
          <li>• Give your expert a clear area of expertise</li>
          <li>• The bio helps define their knowledge boundaries</li>
          <li>• You can add more knowledge after creation</li>
        </ul>
      </div>
    </div>
  );
}
