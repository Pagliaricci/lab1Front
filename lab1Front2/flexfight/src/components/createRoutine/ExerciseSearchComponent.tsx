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
        onClose(addedExercises);
    };

    const renderAddedExercises = () => (
        <div className="w-1/3 p-6 bg-orange-50 border-r border-orange-200">
            <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Added Exercises</h3>
            </div>
            
            {addedExercises.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>No exercises added yet</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {addedExercises.map((exercise, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 text-sm truncate">{exercise.name}</h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {exercise.series} sets × {exercise.reps} reps
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemoveExercise(index)}
                                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-lg flex-shrink-0"
                                    title="Remove exercise"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {addedExercises.length > 0 && (
                <div className="mt-6">
                    <button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                        onClick={handleCompleteExercisesClick}
                    >
                        Save Training Day ({addedExercises.length} exercises)
                    </button>
                </div>
            )}
        </div>
    );

    const renderSearchSection = () => (
        <div className="w-2/3 p-6">
            {!selectedExercise && (
                <div className="space-y-4 mb-6">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search exercises..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            title="Select exercise category"
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

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading exercises...</p>
                </div>
            )}

            {!selectedExercise && exercises.length > 0 && !noResults && (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="p-4 cursor-pointer hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 group"
                            onClick={() => setSelectedExercise(exercise)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-gray-800 group-hover:text-orange-700">{exercise.name}</h4>
                                    <p className="text-sm text-gray-600">{exercise.category}</p>
                                </div>
                                <span className="text-gray-400 group-hover:text-orange-500 text-xl">+</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {noResults && !loading && !selectedExercise && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No exercises found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or category filter</p>
                </div>
            )}

            {selectedExercise && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedExercise.name}</h3>
                        <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                            {selectedExercise.category}
                        </span>
                        <p className="text-gray-600 mt-3 leading-relaxed">{selectedExercise.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Series</label>
                            <input
                                type="number"
                                value={series}
                                onChange={(e) => setSeries(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Number of series"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                            <input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Number of reps"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                                !series || !reps 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                            }`}
                            onClick={handleAddExerciseClick}
                            disabled={!series || !reps}
                        >
                            Add Exercise
                        </button>
                        <button
                            onClick={() => setSelectedExercise(null)}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return <div className="flex w-full min-h-[500px]">{renderAddedExercises()}{renderSearchSection()}</div>;
};

export default ExerciseSearchComponent;
