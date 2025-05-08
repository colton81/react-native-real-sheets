import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  Text,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type PopPickerType = {
  data: any[];
  label?: string;
  displayKey: string;
  selectionKey: string;
  value: any;
  defaultValue?: any;
  onValueChange: (value: any) => void;
  showTrashIcon?: boolean;
  backgroundColor?: string;
  disabled?: boolean;
  clearOnNull?: boolean;
  placeHolder?: string;
  children?: any;
  caption?: string;
  style?: StyleProp<ViewStyle>;
  extraValue?: string;
};

export const PopPicker = ({
  data = [],
  label,
  displayKey,
  selectionKey,
  value,
  defaultValue,
  onValueChange,
  showTrashIcon = false,
  disabled,
  caption,
  style,
  extraValue,
  placeHolder,
}: PopPickerType) => {
  const [selectedValue, setSelectedValue] = useState<any>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const deleteSelection = () => {
    setSelectedValue(null);
    onValueChange(null);
  };

  const handleSelect = (itemValue: any) => {
    setSelectedValue(itemValue);
    const selectedItem = data.find((item) => item[selectionKey] === itemValue);
    if (selectedItem) {
      onValueChange(selectedItem[selectionKey]);
    }
  };

  const borderColor = () => {
    return 'gray';
  };
  const backgroundColor = () => {
    return 'white';
  };
  const fontColor = () => {
    return 'black';
  };
  const displayValue = selectedValue ?? defaultValue;
  const styles = useStyle();
  // if we have extra info we render this item instead of the default picker
  const extraInfoRender = (item: any) => {
    // nested text in a text so we can change the style of extra value if we want to
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 8,
          paddingLeft: 12,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          }}
        >
          {item.value} -{' '}
          <Text numberOfLines={1} style={{ fontSize: 16 }}>
            {item.extraValue}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={[style, styles.container, { paddingTop: label ? 0 : 2 }]}>
      <View style={[styles.dropdownWrapper]}>
        {label ? (
          <View
            style={{ width: '25%', justifyContent: 'center', paddingRight: 2 }}
          >
            {label ? (
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: '600',
                  color: 'gray',
                }}
              >
                {label}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor(),
            borderRadius: 5,
          }}
        >
          <Dropdown
            dropdownPosition="auto"
            selectedTextProps={{ numberOfLines: 2 }}
            showsVerticalScrollIndicator={false}
            style={[styles.dropdown, { borderColor: borderColor() }]}
            placeholderStyle={{
              color: 'gray',
              fontSize: 15,
              overflow: 'hidden',
            }}
            selectedTextStyle={{
              padding: 0,
              color: fontColor(),
            }}
            data={
              data
                ? data.map((item) => ({
                    label: item[displayKey],
                    value: item[selectionKey],
                    extraValue: extraValue ? item?.[extraValue] : null,
                  }))
                : []
            }
            activeColor={'blue'}
            labelField="label"
            renderItem={extraValue ? extraInfoRender : undefined}
            disable={disabled}
            // containerStyle={{ backgroundColor: theme.mainBackgroundColor }}
            itemTextStyle={{ color: fontColor() }}
            itemContainerStyle={{
              borderBottomWidth: 0.5,
              borderBottomColor: 'gray',
              height: 55,
              backgroundColor: 'gray',
            }}
            maxHeight={275}
            valueField="value"
            placeholder={placeHolder ?? ' '}
            value={displayValue}
            renderRightIcon={() =>
              showTrashIcon && value ? (
                <Pressable onPress={deleteSelection}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    color={'red'}
                    size={24}
                    onPress={deleteSelection}
                  />
                </Pressable>
              ) : !disabled ? (
                <View style={{ paddingRight: 0 }}>
                  <MaterialCommunityIcons
                    size={24}
                    color={'blue'}
                    name="chevron-down"
                  />
                </View>
              ) : null
            }
            onChange={(item) => handleSelect(item.value)}
          />
        </View>
      </View>
      {caption ? (
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {label ? (
            <View style={{ width: '25%' }}>
              <Text />
            </View>
          ) : null}
          <Text style={{ fontSize: 12, color: 'lightGray' }}>{caption}</Text>
        </View>
      ) : null}

      {/* {showLocDesc &&
      selectedValue !== "" &&
      selectedValue !== 0 &&
      selectedValue !== null &&
      selectedValue !== undefined ? (
        <Text style={[styles.detailText, { color: theme.text }]}>
          {data?.find(item => item[selectionKey] === selectedValue)?.LocDescription}
        </Text>
      ) : null} */}
    </View>
  );
};

const useStyle = () => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      gap: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 2,
    },
    dropdownWrapper: {
      borderRadius: 5,
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 5,
    },
    dropdown: {
      height: 45,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingLeft: 10,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    trashIcon: {
      fontSize: 24,
      marginTop: 8,
      marginLeft: 10,
      cursor: 'pointer',
    },
    detailText: {
      fontSize: 14,
      marginTop: 4,
    },
    nameInfo: {
      flexDirection: 'row',
      marginTop: 4,
    },
  });
};
export default PopPicker;
