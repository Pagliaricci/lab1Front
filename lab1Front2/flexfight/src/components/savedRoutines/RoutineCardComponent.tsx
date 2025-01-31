import { FaTimes } from 'react-icons/fa';
                                              
                                              interface RoutineCardProps {
                                                  name: string;
                                                  duration: number;
                                                  intensity: string;
                                                  onClick?: () => void; // For expanding the card
                                                  isActive: boolean;
                                                  onActivate?: () => void; // For activating/deactivating
                                                  onDelete?: () => void; // For deleting the routine
                                                  onDeactivate?: () => void; // For deactivating
                                                  onShare?: () => void; // For sharing the routine
                                                  userRole: string; // Add userRole prop
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
                                                  userRole,
                                              }) => {
                                                  return (
                                                      <div
                                                          className="bg-white bg-opacity-65 p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-100 relative"
                                                          onClick={onClick} // Trigger onClick when the card is clicked
                                                      >
                                                          {/* X Button for deletion */}
                                                          <button
                                                              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                                              onClick={(e) => {
                                                                  e.stopPropagation(); // Prevent triggering the card's onClick
                                                                  onDelete?.();
                                                              }}
                                                          >
                                                              <FaTimes size={16} />
                                                          </button>
                                              
                                                          <h2 className="text-2xl font-bold">{name}</h2>
                                                          <p>Duration: {duration} {duration === 1 ? 'week' : 'weeks'}</p>
                                                          <p>Intensity: {intensity}</p>
                                              
                                                          <div className="flex justify-center gap-4 mt-4">
                                                              {/* Activate/Deactivate Button */}
                                                              <button
                                                                  className={`py-1 px-4 rounded-lg text-white font-semibold ${
                                                                      isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                                                  }`}
                                                                  onClick={(e) => {
                                                                      e.stopPropagation(); // Prevent triggering the card's onClick
                                                                      if (isActive) {
                                                                          onDeactivate?.(); // Deactivate the routine
                                                                      } else {
                                                                          onActivate?.(); // Activate the routine
                                                                      }
                                                                  }}
                                                              >
                                                                  {isActive ? 'Deactivate' : 'Activate'}
                                                              </button>
                                              
                                                              {/* Share Button - Only show for Trainer role */}
                                                              {userRole === 'Trainer' && onShare && (
                                                                  <button
                                                                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg font-semibold"
                                                                      onClick={(e) => {
                                                                          e.stopPropagation(); // Prevent triggering the card's onClick
                                                                          onShare?.(); // Share the routine
                                                                      }}
                                                                  >
                                                                      Share
                                                                  </button>
                                                              )}
                                                          </div>
                                                      </div>
                                                  );
                                              };
                                              
                                              export default RoutineCardComponent;