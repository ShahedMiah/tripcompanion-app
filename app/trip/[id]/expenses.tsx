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

/**
 * WAYFARE Expenses Screen - Bento Editorial Design
 *
 * Warm editorial aesthetic with terracotta accents.
 * Group expense tracking with balance calculations.
 */

// Bento Editorial colour palette
const COLORS = {
  cream: '#FFFBF5',
  terracotta: {
    50: '#FEF7F4',
    100: '#FCEEE8',
    500: '#C4704A',
    600: '#A85A38',
  },
  forest: {
    50: '#F0F5F2',
    100: '#E0EBE4',
    500: '#4A7B5A',
    700: '#2D4739',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#D4A574',
    700: '#B8860B',
  },
  stone: {
    100: '#F5F3F0',
    200: '#E8E4DE',
    300: '#D5CFC6',
    500: '#968B7D',
    700: '#5C5147',
  },
  ink: {
    900: '#1A1A1A',
  },
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
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Card variant="elevated" padding="lg">
            <Text style={{ color: COLORS.stone[500], fontSize: 13, fontWeight: '500' }}>Total Group Expenses</Text>
            <Text style={{ fontSize: 36, fontWeight: '700', color: COLORS.ink[900], marginTop: 4, letterSpacing: -1 }}>
              {formatCurrency(totalExpenses)}
            </Text>

            {/* Balance Summary */}
            <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.stone[200] }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.ink[900], marginBottom: 12, letterSpacing: 0.2 }}>
                Balances
              </Text>
              {Object.entries(balances).map(([name, balance]) => (
                <View
                  key={name}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}
                >
                  <Text style={{ color: COLORS.stone[700], fontSize: 15 }}>{name}</Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 15,
                      color: balance > 0
                        ? COLORS.forest[500]
                        : balance < 0
                        ? '#DC2626'
                        : COLORS.stone[500],
                    }}
                  >
                    {balance > 0 ? 'gets back ' : balance < 0 ? 'owes ' : ''}
                    {formatCurrency(Math.abs(balance))}
                  </Text>
                </View>
              ))}
            </View>

            {/* Settle Up Button */}
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={({ pressed }) => ({
                marginTop: 16,
                backgroundColor: COLORS.terracotta[50],
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="swap-horizontal" size={20} color={COLORS.terracotta[500]} />
              <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
                View Settlement Plan
              </Text>
            </Pressable>
          </Card>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
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
        <View style={{ paddingHorizontal: 20, marginTop: 20, paddingBottom: 100 }}>
          {Object.entries(groupedExpenses)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, dayExpenses]) => (
              <View key={dateKey} style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.stone[500], marginBottom: 12, letterSpacing: 0.2 }}>
                  {format(new Date(dateKey), 'EEEE, MMMM d')}
                </Text>
                {dayExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            ))}

          {filteredExpenses.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.stone[300]} />
              <Text style={{ color: COLORS.stone[500], marginTop: 16, fontWeight: '500', fontSize: 15 }}>
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
        style={({ pressed }) => ({
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          backgroundColor: COLORS.terracotta[500],
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: COLORS.terracotta[500],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
        })}
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
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 8,
        backgroundColor: active ? COLORS.terracotta[500] : '#FFFFFF',
        borderWidth: active ? 0 : 1,
        borderColor: COLORS.stone[200],
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={active ? 'white' : iconColor}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={{ fontWeight: '600', fontSize: 14, color: active ? 'white' : COLORS.stone[700] }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const config = expenseCategoryConfig[expense.category];

  return (
    <Card variant="elevated" style={{ marginBottom: 12 }} padding="md">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${config.color}20`,
          }}
        >
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ fontWeight: '600', color: COLORS.ink[900], fontSize: 15 }}>{expense.description}</Text>
          <Text style={{ color: COLORS.stone[500], fontSize: 13, marginTop: 2 }}>
            Paid by {expense.paidByName}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontWeight: '700', color: COLORS.ink[900], fontSize: 17 }}>
            {formatCurrency(expense.amount.amount)}
          </Text>
          <Text style={{ color: COLORS.stone[500], fontSize: 12, marginTop: 2 }}>
            {expense.splitBetween.length} people
          </Text>
        </View>
      </View>

      {/* Split Details */}
      <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.stone[200] }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {expense.splitBetween.map((split) => (
            <View
              key={split.travelerId}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 16,
                marginBottom: 4,
                opacity: split.settled ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginRight: 6,
                  backgroundColor: split.settled ? COLORS.forest[500] : COLORS.amber[500],
                }}
              />
              <Text style={{ fontSize: 13, color: COLORS.stone[700] }}>
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
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.stone[200],
        }}>
          <Pressable onPress={onClose}>
            <Text style={{ color: COLORS.stone[500], fontWeight: '600', fontSize: 15 }}>Cancel</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.ink[900] }}>Add Expense</Text>
          <Pressable onPress={handleSave}>
            <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', fontSize: 15 }}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Amount Input */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ color: COLORS.stone[500], marginBottom: 8, fontSize: 14 }}>Amount</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 40, fontWeight: '300', color: COLORS.stone[300] }}>£</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={COLORS.stone[300]}
                keyboardType="decimal-pad"
                style={{
                  fontSize: 48,
                  fontWeight: '700',
                  color: COLORS.ink[900],
                  marginLeft: 4,
                  minWidth: 100,
                }}
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
            {['10', '25', '50', '100'].map((val) => (
              <Pressable
                key={val}
                onPress={() => setAmount(val)}
                style={({ pressed }) => ({
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: COLORS.stone[100],
                  borderRadius: 12,
                  marginHorizontal: 6,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 15 }}>£{val}</Text>
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.ink[900], marginBottom: 8, letterSpacing: 0.2 }}>
              Description
            </Text>
            <View style={{ backgroundColor: COLORS.stone[100], borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 }}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What was this for?"
                placeholderTextColor={COLORS.stone[500]}
                style={{ color: COLORS.ink[900], fontSize: 16 }}
              />
            </View>
          </View>

          {/* Category */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.ink[900], marginBottom: 12, letterSpacing: 0.2 }}>
              Category
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.entries(expenseCategoryConfig).map(([key, config]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategory(key as ExpenseCategory);
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 12,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: category === key ? COLORS.terracotta[500] : COLORS.stone[100],
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={16}
                    color={category === key ? 'white' : config.color}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontWeight: '600',
                      fontSize: 14,
                      color: category === key ? 'white' : COLORS.ink[900],
                    }}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Paid By */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.ink[900], marginBottom: 12, letterSpacing: 0.2 }}>
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
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    marginRight: 16,
                    padding: 12,
                    borderRadius: 16,
                    backgroundColor: paidBy === traveler.id ? COLORS.terracotta[50] : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View
                    style={{
                      borderRadius: 28,
                      padding: 2,
                      borderWidth: paidBy === traveler.id ? 2 : 0,
                      borderColor: COLORS.terracotta[500],
                    }}
                  >
                    <Avatar
                      source={traveler.avatarUrl}
                      name={traveler.name}
                      size="lg"
                    />
                  </View>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      fontWeight: '500',
                      color: paidBy === traveler.id ? COLORS.terracotta[500] : COLORS.stone[700],
                    }}
                  >
                    {traveler.name.split(' ')[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Receipt */}
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={({ pressed }) => ({
              marginBottom: 32,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: COLORS.stone[300],
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              backgroundColor: pressed ? COLORS.stone[100] : 'transparent',
            })}
          >
            <Ionicons name="camera" size={32} color={COLORS.stone[500]} />
            <Text style={{ color: COLORS.stone[700], fontWeight: '600', marginTop: 8, fontSize: 15 }}>
              Add Receipt Photo
            </Text>
            <Text style={{ color: COLORS.stone[500], fontSize: 13, marginTop: 4 }}>
              Tap to scan or upload
            </Text>
          </Pressable>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: COLORS.stone[200] }}>
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
