import { View, Text, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Card variant="outlined" padding="lg">
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
                paddingVertical: 14,
                paddingHorizontal: 16,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="swap-horizontal" size={18} color={COLORS.terracotta[500]} />
                <Text style={{ color: COLORS.terracotta[500], fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
                  View Settlement Plan
                </Text>
              </View>
            </Pressable>
          </Card>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 24 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}
        >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFilter('all');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 10,
                backgroundColor: selectedFilter === 'all' ? COLORS.terracotta[500] : '#FFFFFF',
                borderWidth: 1,
                borderColor: selectedFilter === 'all' ? COLORS.terracotta[500] : COLORS.stone[200],
              }}
            >
              <Text style={{ fontWeight: '600', fontSize: 14, color: selectedFilter === 'all' ? 'white' : COLORS.ink[900] }}>
                All
              </Text>
            </Pressable>
            {Object.entries(expenseCategoryConfig).map(([key, config]) => (
              <Pressable
                key={key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedFilter(key as ExpenseCategory);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 10,
                  backgroundColor: selectedFilter === key ? COLORS.terracotta[500] : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: selectedFilter === key ? COLORS.terracotta[500] : COLORS.stone[200],
                }}
              >
                <Ionicons
                  name={config.icon as any}
                  size={16}
                  color={selectedFilter === key ? 'white' : config.color}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ fontWeight: '600', fontSize: 14, color: selectedFilter === key ? 'white' : COLORS.ink[900] }}>
                  {config.label}
                </Text>
              </Pressable>
            ))}
        </ScrollView>

        {/* Expenses List */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, paddingBottom: 100 }}>
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
        style={{
          position: 'absolute',
          bottom: Math.max(insets.bottom, 20) + 20,
          right: 20,
          width: 56,
          height: 56,
          backgroundColor: COLORS.terracotta[500],
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 999,
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
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        marginRight: 10,
        backgroundColor: active ? COLORS.terracotta[500] : '#FFFFFF',
        borderWidth: 1.5,
        borderColor: active ? COLORS.terracotta[500] : COLORS.stone[200],
        opacity: pressed ? 0.8 : 1,
        shadowColor: active ? COLORS.terracotta[500] : '#000',
        shadowOffset: { width: 0, height: active ? 2 : 1 },
        shadowOpacity: active ? 0.25 : 0.05,
        shadowRadius: active ? 4 : 2,
        elevation: active ? 3 : 1,
      })}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={18}
          color={active ? 'white' : iconColor}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={{ fontWeight: '600', fontSize: 14, color: active ? 'white' : COLORS.ink[900] }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const config = expenseCategoryConfig[expense.category];

  return (
    <Card variant="outlined" style={{ marginBottom: 12 }} padding="md">
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, columnGap: 16 }}>
          {expense.splitBetween.map((split) => (
            <View
              key={split.travelerId}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                opacity: split.settled ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  marginRight: 6,
                  backgroundColor: split.settled ? COLORS.forest[500] : COLORS.amber[500],
                }}
              />
              <Text style={{ fontSize: 13, color: COLORS.stone[700] }}>
                {split.travelerName.split(' ')[0]}: {formatCurrency(split.amount)}
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
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [paidBy, setPaidBy] = useState(travelers[0]?.id || '');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
    setAmount('');
    setDescription('');
    setCategory('food');
  };

  const quickAmounts = ['10', '25', '50', '100'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: COLORS.stone[200],
        }}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={{ color: COLORS.stone[500], fontWeight: '600', fontSize: 16 }}>Cancel</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.ink[900] }}>Add Expense</Text>
          <Pressable onPress={handleSave} hitSlop={8} disabled={!amount}>
            <Text style={{ color: amount ? COLORS.terracotta[500] : COLORS.stone[300], fontWeight: '600', fontSize: 16 }}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Section */}
          <View style={{
            backgroundColor: '#FFFFFF',
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 20,
            paddingVertical: 32,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
              <Text style={{ fontSize: 36, fontWeight: '600', color: amount ? COLORS.ink[900] : COLORS.stone[300], marginRight: 4 }}>£</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={COLORS.stone[300]}
                keyboardType="decimal-pad"
                style={{
                  fontSize: 56,
                  fontWeight: '700',
                  color: COLORS.ink[900],
                  minWidth: 140,
                  textAlign: 'center',
                }}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              {quickAmounts.map((val, index) => (
                <Pressable
                  key={val}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAmount(val);
                  }}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    backgroundColor: amount === val ? COLORS.terracotta[500] : COLORS.stone[100],
                    borderRadius: 20,
                    marginLeft: index > 0 ? 10 : 0,
                  }}
                >
                  <Text style={{ color: amount === val ? 'white' : COLORS.ink[900], fontWeight: '600', fontSize: 15 }}>£{val}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={{ marginHorizontal: 20, marginTop: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.stone[500], marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Description
            </Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 }}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What was this for?"
                placeholderTextColor={COLORS.stone[300]}
                style={{ color: COLORS.ink[900], fontSize: 15 }}
              />
            </View>
          </View>

          {/* Category */}
          <View style={{ marginTop: 16, marginHorizontal: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.stone[500], marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Category
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(expenseCategoryConfig).map(([key, config]) => {
                const isSelected = category === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCategory(key as ExpenseCategory);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor: isSelected ? COLORS.terracotta[500] : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: isSelected ? COLORS.terracotta[500] : COLORS.stone[200],
                    }}
                  >
                    <Ionicons
                      name={config.icon as any}
                      size={16}
                      color={isSelected ? 'white' : config.color}
                    />
                    <Text
                      style={{
                        marginLeft: 6,
                        fontWeight: '600',
                        fontSize: 13,
                        color: isSelected ? 'white' : COLORS.ink[900],
                      }}
                    >
                      {config.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Paid By */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.stone[500], marginBottom: 10, marginHorizontal: 20, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Paid by
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {travelers.map((traveler, index) => {
                const isSelected = paidBy === traveler.id;
                return (
                  <Pressable
                    key={traveler.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setPaidBy(traveler.id);
                    }}
                    style={{
                      alignItems: 'center',
                      marginRight: index < travelers.length - 1 ? 2 : 0,
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 14,
                        padding: 2,
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: COLORS.terracotta[500],
                      }}
                    >
                      <Avatar
                        source={traveler.avatarUrl}
                        name={traveler.name}
                        size="md"
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? COLORS.terracotta[500] : COLORS.stone[600],
                      }}
                    >
                      {traveler.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Receipt */}
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={{
              marginHorizontal: 20,
              marginTop: 16,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: COLORS.stone[200],
            }}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: COLORS.stone[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="camera-outline" size={22} color={COLORS.stone[500]} />
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={{ color: COLORS.ink[900], fontWeight: '600', fontSize: 15 }}>
                Add Receipt Photo
              </Text>
              <Text style={{ color: COLORS.stone[500], fontSize: 13, marginTop: 2 }}>
                Tap to scan or upload
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.stone[400]} />
          </Pressable>
        </ScrollView>

        {/* Bottom Button */}
        <View style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: COLORS.stone[200]
        }}>
          <Pressable
            onPress={handleSave}
            disabled={!amount}
            style={{
              backgroundColor: amount ? COLORS.terracotta[500] : COLORS.stone[200],
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: amount ? 'white' : COLORS.stone[500], fontWeight: '700', fontSize: 16 }}>
              Add Expense
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
