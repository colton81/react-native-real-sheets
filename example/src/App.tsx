import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RealSheet, type RealSheetRef } from 'react-native-real-sheets';
import PopPicker from './PopPicker';
// Example sheet component
type FilterSheetProps = {
  showFilter: boolean;
  onClose: () => void;
  children: React.ReactNode;
  navBar?: React.ReactNode;
};

export const Sheet = ({
  showFilter,
  onClose,
  children,
  navBar,
}: FilterSheetProps) => {
  const actionSheetRef = useRef<RealSheetRef>(null);

  useEffect(() => {
    if (showFilter) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, [showFilter]);

  return (
    <RealSheet
      ref={actionSheetRef}
      onClose={onClose}
      gestureEnabled
      containerStyle={{
        backgroundColor: 'white',
        maxHeight: '100%',
        height: '100%',
      }}
      indicatorStyle={{
        backgroundColor: 'gray',
      }}
      snapPoints={[40]}
    >
      {navBar}
      <View
        style={{
          paddingBottom: 10,
          paddingHorizontal: 16,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ gap: 10, paddingTop: 10 }}>{children}</View>
        </ScrollView>
      </View>
    </RealSheet>
  );
};
type MenuItem = {
  title: string;
  status?: string;
  onPress: (order?: OrderBy) => void;
};
export enum OrderBy {
  Ascending = 'Ascending',
  Descending = 'Descending',
}
export enum GroupBy {
  Name = 'Name',

  Status = 'Status',
}
export enum SortBy {
  Name = 'Name',
  SalesPerson = 'SalesPerson',
  DateCreated = 'DateCreated',
}
const App = () => {
  // Create reference to control ActionSheet directly
  const [selectedStatus, setFilter] = useState<string>('Enabled');
  const [groupBy, setGroupBy] = useState<{ type: GroupBy; key: string }>({
    type: GroupBy.Name,
    key: 'CompanyName',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<{
    type: SortBy;
    order: OrderBy;
    key: string;
  }>({ type: SortBy.Name, order: OrderBy.Ascending, key: 'CompanyName' });

  const menuItems: MenuItem[] = [
    { title: 'All', status: 'All', onPress: () => setFilter('All') },
    { title: 'Active', status: 'Enabled', onPress: () => setFilter('Enabled') },
    {
      title: 'Inactive',
      status: 'Disabled',
      onPress: () => setFilter('Disabled'),
    },
  ];

  const groupByItems: MenuItem[] = [
    // { title: "Sales Person", onPress: () => setGroupBy({ type: GroupBy.SalesPerson, key: "SalespersonName" }) },
    {
      title: 'Status',
      onPress: () => setGroupBy({ type: GroupBy.Status, key: 'CurStat' }),
    },
    {
      title: 'Name',
      onPress: () => setGroupBy({ type: GroupBy.Name, key: 'CompanyName' }),
    },
  ];
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'Enabled',
    groupBy: 'Name',
    sortBy: 'Ascending',
  });
  const handleApplyFilter = (newFilters: any) => {
    setShowFilter(false);
    setAppliedFilters(newFilters);

    setFilter(newFilters.status);

    const selectedGroupItem = groupByItems.find(
      (item) => item.title === newFilters.groupBy
    );
    if (
      selectedGroupItem &&
      selectedGroupItem.title !== groupBy.type.toString()
    ) {
      selectedGroupItem.onPress();
    }

    const order =
      newFilters.sortBy === 'Ascending'
        ? OrderBy.Ascending
        : OrderBy.Descending;
    if (order !== sortBy.order) {
      setSortBy({
        ...sortBy,
        order,
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Open Action Sheet"
        onPress={() => {
          setShowFilter(true);
        }}
      />
      <Text>{selectedStatus}</Text>

      <Sheet
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        navBar={
          <NavBar
            title="Filter Options"
            onLeftPress={() => setShowFilter(false)}
            onRightPress={() => handleApplyFilter(appliedFilters)}
            leftButton="Cancel"
            rightButton="Done"
          />
        }
      >
        <PopPicker
          label="Status"
          data={menuItems}
          displayKey="title"
          selectionKey="status"
          value={appliedFilters.status}
          onValueChange={(value) =>
            setAppliedFilters({ ...appliedFilters, status: value })
          }
        />

        <PopPicker
          label="Group By"
          data={groupByItems}
          displayKey="title"
          selectionKey="title"
          value={appliedFilters.groupBy}
          onValueChange={(value) =>
            setAppliedFilters({ ...appliedFilters, groupBy: value })
          }
        />
      </Sheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetContent: {
    padding: 20,
    minHeight: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  payloadContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  payloadLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  payloadValue: {
    fontSize: 14,
    color: '#333',
  },
});
export type NavBarProps = {
  leftButton?: React.ReactNode | string;
  rightButton?: React.ReactNode | string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  title: string;
};
export const NavBar = ({
  onLeftPress,
  onRightPress,
  title,
  leftButton,
  rightButton,
}: NavBarProps) => {
  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 8,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {typeof leftButton === 'string' ? (
          <TouchableOpacity onPress={onLeftPress}>
            <Text>{leftButton}</Text>
          </TouchableOpacity>
        ) : (
          leftButton
        )}

        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>

        {typeof rightButton === 'string' ? (
          <TouchableOpacity onPress={onRightPress}>
            <Text>{rightButton}</Text>
          </TouchableOpacity>
        ) : (
          rightButton
        )}
      </View>
    </View>
  );
};
export default App;
