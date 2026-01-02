import { View, Text, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getTripById, getExpensesForTrip, calculateBalances } from '@/lib/mock-data';
import { Expense, ExpenseCategory } from '@/types';
import { Card, Badge, Avatar, Button } from '@/components/ui';
import { expenseCategoryConfig } from '@/constants/theme';
import { formatCurrency } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

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

  const filteredExpenses =
    selectedFilter === 'all'
      ? expenses
      : expenses.filter((e) => e.category === selectedFilter);

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
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View className="px-5 pt-5">
          <Card variant="elevated" padding="lg">
            <Text className="text-slate-500 text-sm">Total Group Expenses</Text>
            <Text className="text-4xl font-bold text-slate-900 mt-1">
              {formatCurrency(totalExpenses)}
            </Text>

            {/* Balance Summary */}
            <View className="mt-5 pt-5 border-t border-slate-100">
              <Text className="text-sm font-semibold text-slate-700 mb-3">
                Balances
              </Text>
              {Object.entries(balances).map(([name, balance]) => (
                <View
                  key={name}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-slate-600">{name}</Text>
                  <Text
                    className={`font-semibold ${
                      balance > 0
                        ? 'text-emerald-600'
                        : balance < 0
                        ? 'text-red-500'
                        : 'text-slate-500'
                    }`}
                  >
                    {balance > 0 ? 'gets back ' : balance < 0 ? 'owes ' : ''}
                    {formatCurrency(Math.abs(balance))}
                  </Text>
                </View>
              ))}
            </View>

            {/* Settle Up Button */}
            <Pressable className="mt-4 bg-primary-50 rounded-2xl p-4 flex-row items-center justify-center active:bg-primary-100">
              <Ionicons name="swap-horizontal" size={20} color="#0D9488" />
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
          className="mt-5"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <FilterChip
            label="All"
            active={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          {Object.entries(expenseCategoryConfig).map(([key, config]) => (
            <FilterChip
              key={key}
              label={config.label}
              icon={config.icon}
              iconColor={config.color}
              active={selectedFilter === key}
              onPress={() => setSelectedFilter(key as ExpenseCategory)}
            />
          ))}
        </ScrollView>

        {/* Expenses List */}
        <View className="px-5 mt-5 pb-24">
          {Object.entries(groupedExpenses)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, dayExpenses]) => (
              <View key={dateKey} className="mb-6">
                <Text className="text-sm font-semibold text-slate-500 mb-3">
                  {format(new Date(dateKey), 'EEEE, MMMM d')}
                </Text>
                {dayExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            ))}

          {filteredExpenses.length === 0 && (
            <View className="items-center py-12">
              <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
              <Text className="text-slate-500 mt-4 font-medium">
                No expenses yet
              </Text>
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
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-2xl items-center justify-center shadow-lg"
        style={{
          shadowColor: '#0D9488',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
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
  iconColor,
  active,
  onPress,
}: {
  label: string;
  icon?: string;
  iconColor?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className={`flex-row items-center px-4 py-2.5 rounded-full mr-2 ${
        active ? 'bg-primary-500' : 'bg-white border border-slate-200'
      }`}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={active ? 'white' : iconColor}
          style={{ marginRight: 6 }}
        />
      )}
      <Text className={`font-semibold ${active ? 'text-white' : 'text-slate-600'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const config = expenseCategoryConfig[expense.category];

  return (
    <Card variant="elevated" className="mb-3" padding="md">
      <View className="flex-row items-center">
        <View
          className="w-11 h-11 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-slate-900">{expense.description}</Text>
          <Text className="text-slate-500 text-sm">
            Paid by {expense.paidByName}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-bold text-slate-900 text-lg">
            {formatCurrency(expense.amount.amount)}
          </Text>
          <Text className="text-slate-400 text-xs">
            {expense.splitBetween.length} people
          </Text>
        </View>
      </View>

      {/* Split Details */}
      <View className="mt-3 pt-3 border-t border-slate-100">
        <View className="flex-row flex-wrap">
          {expense.splitBetween.map((split) => (
            <View
              key={split.travelerId}
              className={`flex-row items-center mr-4 mb-1 ${
                split.settled ? 'opacity-50' : ''
              }`}
            >
              <View
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  split.settled ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <Text className="text-sm text-slate-600">
                {split.travelerName}: {formatCurrency(split.amount)}
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
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [paidBy, setPaidBy] = useState(travelers[0]?.id || '');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
    setAmount('');
    setDescription('');
    setCategory('other');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
          <Pressable onPress={onClose}>
            <Text className="text-slate-500 font-semibold">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-bold text-slate-900">Add Expense</Text>
          <Pressable onPress={handleSave}>
            <Text className="text-primary-600 font-semibold">Save</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5 pt-6">
          {/* Amount Input */}
          <View className="items-center mb-8">
            <Text className="text-slate-500 mb-2">Amount</Text>
            <View className="flex-row items-center">
              <Text className="text-4xl font-light text-slate-400">£</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#CBD5E1"
                keyboardType="decimal-pad"
                className="text-5xl font-bold text-slate-900 ml-1"
                style={{ minWidth: 100 }}
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View className="flex-row justify-center mb-8">
            {['10', '25', '50', '100'].map((val) => (
              <Pressable
                key={val}
                onPress={() => setAmount(val)}
                className="px-5 py-2.5 bg-slate-100 rounded-full mx-1.5 active:bg-slate-200"
              >
                <Text className="text-slate-700 font-semibold">£{val}</Text>
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Description
            </Text>
            <View className="bg-slate-50 rounded-2xl px-4 py-4">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What was this for?"
                placeholderTextColor="#94A3B8"
                className="text-slate-900 text-base"
              />
            </View>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-700 mb-3">
              Category
            </Text>
            <View className="flex-row flex-wrap">
              {Object.entries(expenseCategoryConfig).map(([key, config]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategory(key as ExpenseCategory);
                  }}
                  className={`flex-row items-center px-4 py-2.5 rounded-full mr-2 mb-2 ${
                    category === key ? 'bg-primary-500' : 'bg-slate-100'
                  }`}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={16}
                    color={category === key ? 'white' : config.color}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      category === key ? 'text-white' : 'text-slate-700'
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
            <Text className="text-sm font-semibold text-slate-700 mb-3">
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
                  className={`items-center mr-4 p-3 rounded-2xl ${
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
                    className={`mt-2 text-sm font-medium ${
                      paidBy === traveler.id ? 'text-primary-600' : 'text-slate-600'
                    }`}
                  >
                    {traveler.name.split(' ')[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Receipt */}
          <Pressable className="mb-8 border-2 border-dashed border-slate-300 rounded-2xl p-6 items-center active:bg-slate-50">
            <Ionicons name="camera" size={32} color="#94A3B8" />
            <Text className="text-slate-500 font-semibold mt-2">
              Add Receipt Photo
            </Text>
            <Text className="text-slate-400 text-sm mt-1">
              Tap to scan or upload
            </Text>
          </Pressable>
        </ScrollView>

        <View className="px-5 py-4 border-t border-slate-100">
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
