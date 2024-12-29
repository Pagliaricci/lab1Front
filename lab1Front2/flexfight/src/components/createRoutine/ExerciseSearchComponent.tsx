import React, { useState, useEffect, useCallback } from 'react';

interface Exercise {
    id: string;
    name: string;
    category: string;
    description: string;
}

export interface AddedExercise extends Exercise {
    series: number | string;
    reps: number | string;
}

interface ExerciseSearchProps {
    onClose: (addedExercises: AddedExercise[]) => void;
    initialExercises?: AddedExercise[];
}

const categories = ["Chest", "Shoulders", "Back", "Biceps", "Triceps", "Legs"];

const ExerciseSearchComponent: React.FC<ExerciseSearchProps> = ({ onClose, initialExercises = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [series, setSeries] = useState<number | string>('');
    const [reps, setReps] = useState<number | string>('');
    const [addedExercises, setAddedExercises] = useState<AddedExercise[]>(initialExercises);
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

    const handleAddExerciseClick = () => {
        if (selectedExercise && series && reps) {
            const newExercise: AddedExercise = {
                ...selectedExercise,
                series,
                reps,
            };
            setAddedExercises((prevExercises) => [...prevExercises, newExercise]);
            setSelectedExercise(null);
            setSeries('');
            setReps('');
        }
    };

    const handleRemoveExercise = (index: number) => {
        setAddedExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
    };

    const handleCompleteExercisesClick = () => {
        onClose(addedExercises); // Pass the added exercises to the parent component
    };

    const renderAddedExercises = () => (
        <div className="w-1/3 p-4 border-r border-gray-300">
            <h3 className="text-lg font-bold mb-4">Added Exercises</h3>
            <ul className="space-y-2">
                {addedExercises.map((exercise, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                        <div>
                            <span className="font-bold">{exercise.name}</span>
                            <div className="text-sm">Series: {exercise.series}, Reps: {exercise.reps}</div>
                        </div>
                        <button
                            onClick={() => handleRemoveExercise(index)}
                            type="button"
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                        >
                            ✖
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderSearchSection = () => (
        <div className="w-2/3 p-4">
            <h2 className="text-lg font-bold mb-4">Add Training Day</h2>
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
                        <label className="block text-sm">Series</label>
                        <input
                            type="number"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="Enter number of series"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm">Reps</label>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                            placeholder="Enter number of reps"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                                !series || !reps ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handleAddExerciseClick}
                            disabled={!series || !reps}
                        >
                            Add Exercise
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

            {addedExercises.length > 0 && (
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
                        onClick={handleCompleteExercisesClick}
                    >
                        Complete Exercises for the Day
                    </button>
                </div>
            )}
        </div>
    );

    return <div className="flex w-full">{renderAddedExercises()}{renderSearchSection()}</div>;
};

export default ExerciseSearchComponent;
