import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday } from '../../utils/dateUtils';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Checkbox from '../UI/Checkbox';
import Calendar from '../UI/Calendar';
import Modal from '../UI/Modal';

const Supplements = () => {
  const [data, setData] = useLocalStorage('dailyGlow-supplements', {});
  const [supplements, setSupplements] = useLocalStorage('dailyGlow-supplement-list', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [newSupplement, setNewSupplement] = useState({ name: '', dosage: '' });
  const [newFood, setNewFood] = useState('');

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayData = data[selectedDateStr] || {
    supplementsTaken: {},
    foods: [],
    waterIntake: 0,
    notes: ''
  };

  const updateDayData = (updates) => {
    setData(prev => ({
      ...prev,
      [selectedDateStr]: { ...dayData, ...updates }
    }));
  };

  const addSupplement = () => {
    if (newSupplement.name.trim()) {
      const supplement = {
        id: Date.now(),
        name: newSupplement.name.trim(),
        dosage: newSupplement.dosage.trim() || '1x daily'
      };
      setSupplements(prev => [...prev, supplement]);
      setNewSupplement({ name: '', dosage: '' });
      setShowAddModal(false);
    }
  };

  const toggleSupplement = (id) => {
    updateDayData({
      supplementsTaken: {
        ...dayData.supplementsTaken,
        [id]: !dayData.supplementsTaken[id]
      }
    });
  };

  const addFood = () => {
    if (newFood.trim()) {
      updateDayData({
        foods: [...dayData.foods, {
          id: Date.now(),
          name: newFood.trim()
        }]
      });
      setNewFood('');
      setShowFoodModal(false);
    }
  };

  const removeFood = (id) => {
    updateDayData({
      foods: dayData.foods.filter(food => food.id !== id)
    });
  };

  const updateWaterIntake = (glasses) => {
    updateDayData({ waterIntake: Math.max(0, glasses) });
  };

  const commonSupplements = ['Vitamin D3', 'Omega-3', 'Zinc', 'Biotin', 'Iron', 'B Complex', 'Vitamin C', 'Magnesium'];
  const healthyFoods = ['Walnuts', 'Salmon', 'Avocado', 'Sweet Potato', 'Spinach', 'Blueberries', 'Greek Yogurt', 'Green Tea'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Supplements & Nutrition
        </h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddModal(true)} size="sm">
            Add Supplement
          </Button>
          <Button onClick={() => setShowFoodModal(true)} size="sm" variant="secondary">
            Log Food
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            markedDates={Object.keys(data).reduce((acc, date) => {
              const dayData = data[date];
              acc[date] = Object.values(dayData.supplementsTaken || {}).some(taken => taken);
              return acc;
            }, {})}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Supplements */}
          <Card title="Daily Supplements">
            {supplements.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No supplements added yet</p>
            ) : (
              <div className="space-y-3">
                {supplements.map(supplement => (
                  <div key={supplement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={dayData.supplementsTaken[supplement.id] || false}
                        onChange={() => toggleSupplement(supplement.id)}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {supplement.name}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {supplement.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Water Intake */}
          <Card title="Water Intake">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateWaterIntake(dayData.waterIntake - 1)}
              >
                -
              </Button>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {dayData.waterIntake}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">glasses</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateWaterIntake(dayData.waterIntake + 1)}
              >
                +
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex space-x-1">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      i < dayData.waterIntake 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Goal: 8-12 glasses per day
              </p>
            </div>
          </Card>

          {/* Foods */}
          <Card title="Healthy Foods">
            {dayData.foods.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No foods logged today</p>
            ) : (
              <div className="space-y-2">
                {dayData.foods.map(food => (
                  <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{food.name}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFood(food.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card title="Nutrition Notes">
            <textarea
              value={dayData.notes}
              onChange={(e) => updateDayData({ notes: e.target.value })}
              placeholder="How did you feel? Any reactions or improvements?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </Card>
        </div>
      </div>

      {/* Add Supplement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Supplement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Common Supplements:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {commonSupplements.map(supp => (
                <Button
                  key={supp}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewSupplement({ name: supp, dosage: '1x daily' })}
                >
                  {supp}
                </Button>
              ))}
            </div>
          </div>
          
          <Input
            label="Supplement Name"
            value={newSupplement.name}
            onChange={(e) => setNewSupplement(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Input
            label="Dosage"
            value={newSupplement.dosage}
            onChange={(e) => setNewSupplement(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 1x daily, 500mg twice daily"
          />
          
          <div className="flex space-x-2">
            <Button onClick={addSupplement} className="flex-1">
              Add Supplement
            </Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Food Modal */}
      <Modal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        title="Log Healthy Food"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggested Foods:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {healthyFoods.map(food => (
                <Button
                  key={food}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewFood(food)}
                >
                  {food}
                </Button>
              ))}
            </div>
          </div>
          
          <Input
            label="Food Item"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            placeholder="Enter food item..."
          />
          
          <div className="flex space-x-2">
            <Button onClick={addFood} className="flex-1">
              Add Food
            </Button>
            <Button variant="secondary" onClick={() => setShowFoodModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Supplements;