import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday } from '../../utils/dateUtils';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Checkbox from '../UI/Checkbox';
import Calendar from '../UI/Calendar';

const Haircare = () => {
  const [data, setData] = useLocalStorage('dailyGlow-haircare', {});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayData = data[selectedDateStr] || {
    washDay: false,
    oiling: false,
    dandruff: false,
    hairFall: 0,
    treatments: [],
    notes: ''
  };

  const updateDayData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDateStr]: { ...dayData, ...updates }
    }));
  };

  const toggleCheck = (field) => {
    updateDayData({ [field]: !dayData[field] });
  };

  const updateHairFall = (level) => {
    updateDayData({ hairFall: level });
  };

  const addTreatment = (treatment) => {
    updateDayData({ 
      treatments: [...dayData.treatments, {
        id: Date.now(),
        name: treatment,
        date: selectedDateStr
      }]
    });
  };

  const removeTreatment = (id) => {
    updateDayData({ 
      treatments: dayData.treatments.filter(t => t.id !== id)
    });
  };

  const hairFallLevels = [
    { level: 0, label: 'None', color: 'bg-green-500' },
    { level: 1, label: 'Minimal', color: 'bg-yellow-400' },
    { level: 2, label: 'Moderate', color: 'bg-orange-500' },
    { level: 3, label: 'High', color: 'bg-red-500' },
  ];

  const treatments = ['Deep Conditioning', 'Protein Treatment', 'Hot Oil Massage', 'Scalp Massage', 'Hair Mask'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Haircare Tracker
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            markedDates={Object.keys(data).reduce((acc, date) => {
              acc[date] = data[date].washDay || data[date].oiling;
              return acc;
            }, {})}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Daily Care */}
          <Card title="Daily Hair Care">
            <div className="space-y-4">
              <Checkbox
                label="Hair Wash Day"
                checked={dayData.washDay}
                onChange={() => toggleCheck('washDay')}
              />
              <Checkbox
                label="Hair Oiling"
                checked={dayData.oiling}
                onChange={() => toggleCheck('oiling')}
              />
              <Checkbox
                label="Dandruff Present"
                checked={dayData.dandruff}
                onChange={() => toggleCheck('dandruff')}
              />
            </div>
          </Card>

          {/* Hair Fall Tracker */}
          <Card title="Hair Fall Level">
            <div className="space-y-3">
              {hairFallLevels.map(({ level, label, color }) => (
                <label key={level} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hairfall"
                    checked={dayData.hairFall === level}
                    onChange={() => updateHairFall(level)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <div className={`w-4 h-4 rounded-full ${color}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Treatments */}
          <Card title="Treatments & Remedies">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {treatments.map(treatment => (
                  <Button
                    key={treatment}
                    variant="outline"
                    size="sm"
                    onClick={() => addTreatment(treatment)}
                  >
                    + {treatment}
                  </Button>
                ))}
              </div>
              
              {dayData.treatments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Treatments:</h4>
                  {dayData.treatments.map(treatment => (
                    <div key={treatment.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-gray-100">{treatment.name}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeTreatment(treatment.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card title="Hair Notes">
            <textarea
              value={dayData.notes}
              onChange={(e) => updateDayData({ notes: e.target.value })}
              placeholder="Hair condition, new products, observations..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Haircare;