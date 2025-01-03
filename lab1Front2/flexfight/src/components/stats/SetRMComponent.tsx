import React, { useState, useEffect, useCallback } from 'react';

interface Exercise {
    id: string;
    name: string;
    category: string;
    description: string;
}

interface SetRMProps {
    onSetRM: (exerciseId: string, rm: number) => void;
}

const categories = ["Chest", "Shoulders", "Back", "Biceps", "Triceps", "Legs"];

const SetRMComponent: React.FC<SetRMProps> = ({ onSetRM }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [rm, setRM] = useState<number | string>('');
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        try {
            const url = new URL('http://localhost:8081/api/exercises');
            if (searchQuery) url.searchParams.append('search', searchQuery);
            if (selectedCategory) url.searchParams.append('category', selectedCategory);

            const response = await fetch(url.toString());
            const data = await response.json();
            setExercises(data);
            setNoResults(data.length === 0);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const handleSetRMClick = () => {
        if (selectedExercise && rm) {
            onSetRM(selectedExercise.id, Number(rm));
            setSelectedExercise(null);
            setRM('');
        }
    };

    const renderSearchSection = () => (
        <div className="w-full p-4">
            <h2 className="text-lg font-bold mb-4">Set RM</h2>
            {!selectedExercise && (
                <div>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search exercises"
                            className="w-full p-2 border rounded-lg pl-10"
                        />
                        <span className="absolute left-3 top-2 text-gray-500">🔍</span>
                    </div>

                    <div className="mb-4">
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {loading && <div>Loading exercises...</div>}

            {!selectedExercise && exercises.length > 0 && !noResults && (
                <div className="overflow-y-auto max-h-[200px]">
                    <ul className="space-y-2">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                                onClick={() => setSelectedExercise(exercise)}
                            >
                                {exercise.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {noResults && !loading && !selectedExercise && (
                <div className="text-center text-gray-500">No exercises found</div>
            )}

            {selectedExercise && (
                <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">{selectedExercise.name}</h3>
                    <p className="text-center text-sm mb-4">{selectedExercise.description}</p>

                    <div className="mb-2">
                        <label className="block text-sm">RM</label>
                        <input
                            type="number"
                            value={rm}
                            onChange={(e) => setRM(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="Enter RM"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                                !rm ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handleSetRMClick}
                            disabled={!rm}
                        >
                            Set RM
                        </button>
                        <button
                            onClick={() => setSelectedExercise(null)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return <div className="flex w-full">{renderSearchSection()}</div>;
};

export default SetRMComponent;