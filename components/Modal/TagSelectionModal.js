import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import { categoriesWithTags, getCategoryTranslation } from '../../Data/CategoryandTag';

const { height: screenHeight } = Dimensions.get('window');

const TagSelectionModal = ({
  visible,
  onClose,
  onTagsSelected,
  selectedTags = [],
  maxTags = 5,
}) => {
  const { theme } = useTheme();
  const { tTagModal, tCategories, tTags } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState(null);

  // All tags flattened once with unique keys
  const allTags = useMemo(() => {
    const tagMap = new Map();
    
    categoriesWithTags.forEach((category) => {
      category.tags.forEach((tag) => {
        const key = `${tag}-${category.name}`;
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            category: category.name,
            categoryIcon: `${category.icon}-outline`,
            categories: [category.name], // Track all categories this tag belongs to
            key: key,
          });
        } else {
          // If tag already exists, add this category to its categories list
          const existingTag = tagMap.get(tag);
          existingTag.categories.push(category.name);
        }
      });
    });
    
    return Array.from(tagMap.values());
  }, []);

  // Filtered tags (by category only)
  const filteredTags = useMemo(() => {
    let list = allTags;
    if (selectedCategory) {
      // Show tags that belong to the selected category
      list = list.filter((t) => t.categories.includes(selectedCategory));
    }
    return list;
  }, [allTags, selectedCategory]);

  const toggleTag = useCallback(
    (tag) => {
      const isSelected = selectedTags.some((x) => x.name === tag.name);
      if (isSelected) {
        onTagsSelected(selectedTags.filter((x) => x.name !== tag.name));
      } else if (selectedTags.length < maxTags) {
        onTagsSelected([...selectedTags, tag]);
      }
    },
    [selectedTags, maxTags, onTagsSelected]
  );

  const removeSelected = useCallback(
    (name) => {
      onTagsSelected(selectedTags.filter((x) => x.name !== name));
    },
    [selectedTags, onTagsSelected]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const clearAllSelected = useCallback(() => {
    onTagsSelected([]);
  }, [onTagsSelected]);

  const isDisabledAdd = (tagName) =>
    !selectedTags.some((x) => x.name === tagName) && selectedTags.length >= maxTags;

  // Tag translation function
  const getTagTranslation = (tagName) => {
    return tTags(tagName) || tagName;
  };

  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    container: {
      backgroundColor: theme.cardBackground,
      borderRadius: 22,
      width: '100%',
      height: screenHeight * 0.7,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 15,
      borderBottomWidth: StyleSheet.hairlineWidth + 0.5,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    closeButton: { 
      padding: 5,
      borderRadius: 20,
    },

    content: { flex: 1 },
    section: { paddingHorizontal: 0, paddingTop: 12 },

    categoriesWrap: { paddingLeft: 0 },

    // Categories (pills) - matching app design
    catPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      height: 38,
      borderRadius: 19,
      borderWidth: 1,
      marginRight: 10,
      backgroundColor: theme.surfaceLight,
    },
    catPillText: { 
      fontSize: 13, 
      fontWeight: '600',
      color: theme.textPrimary,
    },

    // Selected tags rail
    selectedHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingHorizontal: 20,
    },
    selectedCount: { 
      color: theme.textSecondary, 
      fontSize: 13,
      fontWeight: '500',
    },
    clearSelectedBtn: { 
      paddingVertical: 6, 
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    clearSelectedText: { 
      color: theme.textSecondary, 
      fontSize: 13,
      fontWeight: '500',
    },
    selectedChipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 20,
    },
    chipSelected: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.primary,
    },
    chipSelectedText: { 
      color: 'white', 
      fontWeight: '600',
      fontSize: 13,
    },

    // Tags cloud
    tagsHeader: {
      marginTop: 12,
      marginBottom: 8,
      color: theme.textPrimary,
      fontWeight: '600',
      fontSize: 16,
      paddingHorizontal: 20,
    },
    tagCloudWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      paddingBottom: 16,
      paddingHorizontal: 20,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      backgroundColor: theme.surfaceLight,
    },
    tagChipText: { 
      fontSize: 14, 
      fontWeight: '500',
      color: theme.textPrimary,
    },

    // Footer - matching app design
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderTopWidth: StyleSheet.hairlineWidth + 0.5,
      borderTopColor: theme.border,
      backgroundColor: theme.surfaceLight,
    },
    clearButton: { 
      paddingVertical: 8, 
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    clearText: { 
      color: theme.textSecondary, 
      fontSize: 14,
      fontWeight: '500',
    },
    doneButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    doneText: { 
      color: 'white', 
      fontSize: 16, 
      fontWeight: '600',
    },
  }), [theme]);

  const renderCategory = ({ item }) => {
    const active = selectedCategory === item.name;
    const bg = active ? theme.primary : theme.surfaceLight;
    const border = active ? theme.primary : theme.border;
    const textColor = active ? 'white' : theme.textPrimary;
    const iconColor = active ? 'white' : theme.primary;

    return (
      <TouchableOpacity
        style={[styles.catPill, { backgroundColor: bg, borderColor: border }]}
        onPress={() => setSelectedCategory(active ? null : item.name)}
        activeOpacity={0.8}
      >
        <Ionicons name={`${item.icon}-outline`} size={18} color={iconColor} />
        <Text style={[styles.catPillText, { color: textColor }]}>
          {getCategoryTranslation(item.name, tCategories)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{tTagModal('selectTags')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 10 }}
              keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

              {/* Categories */}
              <View style={[styles.section, styles.categoriesWrap]}>
                <FlatList
                  data={categoriesWithTags}
                  keyExtractor={(it) => it.name}
                  renderItem={renderCategory}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              {/* Selected rail */}
              <View style={styles.section}>
                <View style={styles.selectedHeaderRow}>
                  <Text style={styles.selectedCount}>
                    {tTagModal('selected')} ({selectedTags.length} / {maxTags})
                  </Text>
                  {selectedTags.length > 0 && (
                    <TouchableOpacity
                      onPress={clearAllSelected}
                      style={styles.clearSelectedBtn}
                    >
                      <Text style={styles.clearSelectedText}>{tTagModal('clearSelected')}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                 <View style={styles.selectedChipsWrap}>
                   {selectedTags.map((tag) => (
                     <View key={tag.name} style={styles.chipSelected}>
                       <Ionicons name="pricetag" size={14} color="white" />
                       <Text style={styles.chipSelectedText}>#{getTagTranslation(tag.name)}</Text>
                       <TouchableOpacity onPress={() => removeSelected(tag.name)}>
                         <Ionicons name="close" size={14} color="white" />
                       </TouchableOpacity>
                     </View>
                   ))}
                 </View>
              </View>

              {/* Tags cloud */}
              <View style={styles.section}>
                <Text style={styles.tagsHeader}>
                  {tTagModal('availableTags')} ({filteredTags.length})
                </Text>

                 <View style={styles.tagCloudWrap}>
                   {filteredTags.map((item) => {
                     const selected = selectedTags.some((x) => x.name === item.name);
                     const disabled = isDisabledAdd(item.name);

                     const bg = selected ? theme.primary : theme.surfaceLight;
                     const border = selected ? theme.primary : theme.border;
                     const text = selected ? 'white' : theme.textPrimary;
                     const iconColor = selected ? 'white' : theme.primary;

                     return (
                       <TouchableOpacity
                         key={item.key} // Use unique key instead of item.name
                         onPress={() => (!disabled ? toggleTag(item) : null)}
                         disabled={disabled}
                         activeOpacity={0.8}
                         style={[
                           styles.tagChip,
                           {
                             backgroundColor: bg,
                             borderColor: border,
                             opacity: disabled ? 0.5 : 1,
                           },
                         ]}
                       >
                         <Ionicons
                           name={selected ? 'checkmark' : 'pricetag-outline'}
                           size={14}
                           color={iconColor}
                         />
                         <Text style={[styles.tagChipText, { color: text }]}>
                           #{getTagTranslation(item.name)}
                         </Text>
                       </TouchableOpacity>
                     );
                   })}
                 </View>
              </View>
            </ScrollView>
          </View>

          {/* Footer (same size as before) */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearText}>{tTagModal('clearFilters')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneText}>{tTagModal('done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TagSelectionModal;
