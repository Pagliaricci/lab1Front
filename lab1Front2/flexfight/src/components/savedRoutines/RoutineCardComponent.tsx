import { FaTimes } from 'react-icons/fa';
                                                                  
                                                                  interface RoutineCardProps {
                                                                      name: string;
                                                                      duration: number;
                                                                      intensity: string;
                                                                      onClick?: () => void;
                                                                      isActive: boolean;
                                                                      onActivate?: () => void;
                                                                      onDelete?: () => void;
                                                                      onDeactivate?: () => void;
                                                                      onShare?: () => void;
                                                                      onShowHistory?: () => void;
                                                                      userRole: string;
                                                                  }
                                                                  
                                                                  const RoutineCardComponent: React.FC<RoutineCardProps> = ({
                                                                      name,
                                                                      duration,
                                                                      intensity,
                                                                      onClick,
                                                                      isActive,
                                                                      onActivate,
                                                                      onDelete,
                                                                      onDeactivate,
                                                                      onShare,
                                                                      onShowHistory,
                                                                      userRole,
                                                                  }) => {
                                                                      return (
                                                                          <div
                                                                              className="bg-white bg-opacity-65 p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-100 relative"
                                                                              onClick={onClick}
                                                                          >
                                                                              <button
                                                                                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                                                                  onClick={(e) => {
                                                                                      e.stopPropagation();
                                                                                      onDelete?.();
                                                                                  }}
                                                                              >
                                                                                  <FaTimes size={16} />
                                                                              </button>
                                                                  
                                                                              <h2 className="text-2xl font-bold">{name}</h2>
                                                                              <p>Duration: {duration} {duration === 1 ? 'week' : 'weeks'}</p>
                                                                              <p>Intensity: {intensity}</p>
                                                                  
                                                                              <div className="flex justify-center gap-4 mt-4">
                                                                                  {userRole === 'User' && (
                                                                                      <button
                                                                                          className={`py-1 px-4 rounded-lg text-white font-semibold ${
                                                                                              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                                                                          }`}
                                                                                          onClick={(e) => {
                                                                                              e.stopPropagation();
                                                                                              if (isActive) {
                                                                                                  onDeactivate?.();
                                                                                              } else {
                                                                                                  onActivate?.();
                                                                                              }
                                                                                          }}
                                                                                      >
                                                                                          {isActive ? 'Deactivate' : 'Activate'}
                                                                                      </button>
                                                                                  )}
                                                                  
                                                                                  {userRole === 'Trainer' && (
                                                                                      <>
                                                                                          {onShare && (
                                                                                              <button
                                                                                                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg font-semibold"
                                                                                                  onClick={(e) => {
                                                                                                      e.stopPropagation();
                                                                                                      onShare?.();
                                                                                                  }}
                                                                                              >
                                                                                                  Share
                                                                                              </button>
                                                                                          )}
                                                                                          {onShowHistory && (
                                                                                              <button
                                                                                                  className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-4 rounded-lg font-semibold"
                                                                                                  onClick={(e) => {
                                                                                                      e.stopPropagation();
                                                                                                      onShowHistory?.();
                                                                                                  }}
                                                                                              >
                                                                                                  Show History
                                                                                              </button>
                                                                                          )}
                                                                                      </>
                                                                                  )}
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  };
                                                                  
                                                                  export default RoutineCardComponent;