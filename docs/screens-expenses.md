# Step 7: Expense Tracking Screens

## Expenses List Screen

### Create `app/trip/[id]/expenses.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getExpensesForTrip, calculateBalances } from '@/lib/mock-data';
import { Expense, ExpenseCategory } from '@/types';
import { Card, Badge, Avatar, Button } from '@/components/ui';
import * as Haptics from 'expo-haptics';

const categoryConfig: Record<ExpenseCategory, { icon: string; color: string; label: string }> = {
  food: { icon: 'restaurant', color: '#F59E0B', label: 'Food & Drink' },
  transport: { icon: 'car', color: '#3B82F6', label: 'Transport' },
  activity: { icon: 'compass', color: '#10B981', label: 'Activities' },
  accommodation: { icon: 'bed', color: '#8B5CF6', label: 'Accommodation' },
  shopping: { icon: 'bag', color: '#EC4899', label: 'Shopping' },
  other: { icon: 'ellipsis-horizontal', color: '#6B7280', label: 'Other' },
};

export default function ExpensesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trip = getTripById(id);
  const expenses = getExpensesForTrip(id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ExpenseCategory | 'all'>('all');

  if (!trip) return null;

  const balances = calculateBalances(expenses);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount.amount, 0);

  const filteredExpenses = selectedFilter === 'all'
    ? expenses
    : expenses.filter(e => e.category === selectedFilter);

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const dateKey = format(expense.date, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View className="px-5 pt-5">
          <Card padding="lg">
            <Text className="text-gray-500 text-sm">Total Group Expenses</Text>
            <Text className="text-4xl font-bold text-gray-900 mt-1">
              £{totalExpenses.toLocaleString()}
            </Text>

            {/* Balance Summary */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Balances
              </Text>
              {Object.entries(balances).map(([name, balance]) => (
                <View key={name} className="flex-row items-center justify-between py-1.5">
                  <Text className="text-gray-600">{name}</Text>
                  <Text
                    className={`font-semibold ${
                      balance > 0
                        ? 'text-green-600'
                        : balance < 0
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {balance > 0 ? 'gets back ' : balance < 0 ? 'owes ' : ''}
                    £{Math.abs(balance).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Settle Up Button */}
            <Pressable className="mt-4 bg-primary-50 rounded-xl p-3 flex-row items-center justify-center">
              <Ionicons name="swap-horizontal" size={20} color="#6366F1" />
              <Text className="text-primary-600 font-semibold ml-2">
                View Settlement Plan
              </Text>
            </Pressable>
          </Card>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <FilterChip
            label="All"
            active={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          {Object.entries(categoryConfig).map(([key, config]) => (
            <FilterChip
              key={key}
              label={config.label}
              icon={config.icon}
              active={selectedFilter === key}
              onPress={() => setSelectedFilter(key as ExpenseCategory)}
            />
          ))}
        </ScrollView>

        {/* Expenses List */}
        <View className="px-5 mt-4 pb-24">
          {Object.entries(groupedExpenses)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, dayExpenses]) => (
              <View key={dateKey} className="mb-6">
                <Text className="text-sm font-semibold text-gray-500 mb-2">
                  {format(new Date(dateKey), 'EEEE, MMMM d')}
                </Text>
                {dayExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            ))}

          {filteredExpenses.length === 0 && (
            <View className="items-center py-12">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4">No expenses yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Expense FAB */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowAddModal(true);
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        travelers={trip.travelers}
      />
    </View>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className={`
        flex-row items-center px-4 py-2 rounded-full mr-2
        ${active ? 'bg-primary-500' : 'bg-white border border-gray-200'}
      `}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={active ? 'white' : '#6B7280'}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        className={`font-medium ${active ? 'text-white' : 'text-gray-600'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const config = categoryConfig[expense.category];

  return (
    <Card className="mb-2" padding="md">
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Ionicons name={config.icon as any} size={20} color={config.color} />
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-medium text-gray-900">{expense.description}</Text>
          <Text className="text-gray-500 text-sm">
            Paid by {expense.paidByName}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-bold text-gray-900">
            £{expense.amount.amount.toFixed(2)}
          </Text>
          <Text className="text-gray-400 text-xs">
            {expense.splitBetween.length} people
          </Text>
        </View>
      </View>

      {/* Split Details */}
      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row flex-wrap">
          {expense.splitBetween.map((split) => (
            <View
              key={split.oderId}
              className={`flex-row items-center mr-4 mb-1 ${
                split.settled ? 'opacity-50' : ''
              }`}
            >
              <View
                className={`w-2 h-2 rounded-full mr-1 ${
                  split.settled ? 'bg-green-500' : 'bg-amber-500'
                }`}
              />
              <Text className="text-sm text-gray-600">
                {split.travelerName}: £{split.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

function AddExpenseModal({
  visible,
  onClose,
  travelers,
}: {
  visible: boolean;
  onClose: () => void;
  travelers: any[];
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [paidBy, setPaidBy] = useState(travelers[0]?.id || '');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('other');
    setSplitType('equal');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
          <Pressable onPress={onClose}>
            <Text className="text-gray-500 font-medium">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">Add Expense</Text>
          <Pressable onPress={handleSave}>
            <Text className="text-primary-500 font-semibold">Save</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5 pt-6">
          {/* Amount Input */}
          <View className="items-center mb-8">
            <Text className="text-gray-500 mb-2">Amount</Text>
            <View className="flex-row items-center">
              <Text className="text-4xl font-light text-gray-400">£</Text>
              <Text
                className={`text-5xl font-bold ${
                  amount ? 'text-gray-900' : 'text-gray-300'
                }`}
              >
                {amount || '0.00'}
              </Text>
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View className="flex-row justify-center mb-8">
            {['10', '25', '50', '100'].map((val) => (
              <Pressable
                key={val}
                onPress={() => setAmount(val)}
                className="px-5 py-2 bg-gray-100 rounded-full mx-1"
              >
                <Text className="text-gray-700 font-medium">£{val}</Text>
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Description
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Pressable className="flex-row items-center">
                <Ionicons name="create-outline" size={20} color="#9CA3AF" />
                <Text className="text-gray-500 ml-2">
                  {description || 'What was this for?'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Category
            </Text>
            <View className="flex-row flex-wrap">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategory(key as ExpenseCategory);
                  }}
                  className={`flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 ${
                    category === key
                      ? 'bg-primary-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={16}
                    color={category === key ? 'white' : config.color}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      category === key ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Paid By */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Paid by
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {travelers.map((traveler) => (
                <Pressable
                  key={traveler.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPaidBy(traveler.id);
                  }}
                  className={`items-center mr-4 p-3 rounded-xl ${
                    paidBy === traveler.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <View
                    className={`rounded-full p-0.5 ${
                      paidBy === traveler.id ? 'border-2 border-primary-500' : ''
                    }`}
                  >
                    <Avatar
                      source={traveler.avatarUrl}
                      name={traveler.name}
                      size="lg"
                    />
                  </View>
                  <Text
                    className={`mt-2 text-sm ${
                      paidBy === traveler.id
                        ? 'text-primary-600 font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {traveler.name.split(' ')[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Split Type */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Split
            </Text>
            <View className="flex-row">
              <Pressable
                onPress={() => setSplitType('equal')}
                className={`flex-1 py-3 rounded-l-xl border-2 items-center ${
                  splitType === 'equal'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <Ionicons
                  name="people"
                  size={20}
                  color={splitType === 'equal' ? '#6366F1' : '#6B7280'}
                />
                <Text
                  className={`mt-1 font-medium ${
                    splitType === 'equal' ? 'text-primary-600' : 'text-gray-600'
                  }`}
                >
                  Split Equally
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSplitType('custom')}
                className={`flex-1 py-3 rounded-r-xl border-2 border-l-0 items-center ${
                  splitType === 'custom'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <Ionicons
                  name="calculator"
                  size={20}
                  color={splitType === 'custom' ? '#6366F1' : '#6B7280'}
                />
                <Text
                  className={`mt-1 font-medium ${
                    splitType === 'custom' ? 'text-primary-600' : 'text-gray-600'
                  }`}
                >
                  Custom Split
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Receipt */}
          <Pressable className="mb-8 border-2 border-dashed border-gray-300 rounded-xl p-6 items-center">
            <Ionicons name="camera" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 font-medium mt-2">
              Add Receipt Photo
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Tap to scan or upload
            </Text>
          </Pressable>
        </ScrollView>

        {/* Numpad would go here in real implementation */}
        <View className="px-5 py-4 border-t border-gray-100">
          <Button
            title="Add Expense"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!amount}
          />
        </View>
      </View>
    </Modal>
  );
}
```
