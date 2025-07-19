import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday } from '../../utils/dateUtils';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Checkbox from '../UI/Checkbox';
import Calendar from '../UI/Calendar';
import Modal from '../UI/Modal';

const Skincare = () => {
  const [data, setData] = useLocalStorage('dailyGlow-skincare', {});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newConcern, setNewConcern] = useState('');

  const today = getToday();
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayData = data[selectedDateStr] || {
    morningRoutine: false,
    eveningRoutine: false,
    concerns: [],
    notes: '',
    products: []
  };

  const updateDayData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDateStr]: { ...dayData, ...updates }
    }));
  };

  const toggleRoutine = (routine) => {
    updateDayData({ [routine]: !dayData[routine] });
  };

  const addConcern = () => {
    if (newConcern.trim()) {
      updateDayData({ 
        concerns: [...dayData.concerns, { 
          id: Date.now(), 
          text: newConcern.trim(), 
          severity: 1,
          date: selectedDateStr
        }] 
      });
      setNewConcern('');
      setShowModal(false);
    }
  };

  const removeConcern = (id) => {
    updateDayData({ 
      concerns: dayData.concerns.filter(concern => concern.id !== id) 
    });
  };

  const updateSeverity = (id, severity) => {
    updateDayData({ 
      concerns: dayData.concerns.map(concern => 
        concern.id === id ? { ...concern, severity } : concern
      ) 
    });
  };

  const updateNotes = (notes) => {
    updateDayData({ notes });
  };

  const concerns = ['Acne', 'Dryness', 'Purging', 'Redness', 'Oily T-zone', 'Dark spots', 'Fine lines'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Skincare Tracker
        </h2>
        <Button onClick={() => setShowModal(true)} size="sm">
          Add Concern
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            markedDates={Object.keys(data).reduce((acc, date) => {
              acc[date] = data[date].morningRoutine || data[date].eveningRoutine;
              return acc;
            }, {})}
          />
        </div>

        {/* Daily Routines */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Daily Routines">
            <div className="space-y-4">
              <Checkbox
                label="Morning Routine Completed"
                checked={dayData.morningRoutine}
                onChange={() => toggleRoutine('morningRoutine')}
              />
              <Checkbox
                label="Evening Routine Completed"
                checked={dayData.eveningRoutine}
                onChange={() => toggleRoutine('eveningRoutine')}
              />
            </div>
          </Card>

          {/* Skin Concerns */}
          <Card title="Skin Concerns">
            {dayData.concerns.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No concerns logged for this day</p>
            ) : (
              <div className="space-y-3">
                {dayData.concerns.map(concern => (
                  <div key={concern.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {concern.text}
                      </span>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Severity:</span>
                        {[1, 2, 3, 4, 5].map(level => (
                          <button
                            key={level}
                            onClick={() => updateSeverity(concern.id, level)}
                            className={`w-4 h-4 rounded-full border-2 ${
                              level <= concern.severity
                                ? 'bg-red-500 border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeConcern(concern.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card title="Daily Notes">
            <textarea
              value={dayData.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="How did your skin feel today? Any new products tried?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </Card>
        </div>
      </div>

      {/* Add Concern Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Skin Concern"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Select:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {concerns.map(concern => (
                <Button
                  key={concern}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewConcern(concern)}
                >
                  {concern}
                </Button>
              ))}
            </div>
          </div>
          
          <Input
            label="Custom Concern"
            value={newConcern}
            onChange={(e) => setNewConcern(e.target.value)}
            placeholder="Enter custom concern..."
          />
          
          <div className="flex space-x-2">
            <Button onClick={addConcern} className="flex-1">
              Add Concern
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Skincare;