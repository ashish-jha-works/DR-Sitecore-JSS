import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomRichText } from 'src/common/SitecoreOverrides';

import ArrowLeft from 'assets/icons/ArrowLeft';
import CategoryIcon from 'assets/icons/CategoryIcon';
import CrossIcon from 'assets/icons/CrossIcon';
import SearchIcon from 'assets/icons/SearchIcon';
import { Accordion } from 'components/common/Accordion';
import { Input } from 'components/common/Input';
import { flattenSiteCoreFields } from 'lib/utils/helper';

export default function FAQPage({ fields: siteCoreFields }: any) {
  const fields = flattenSiteCoreFields(siteCoreFields);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [FAQList, setFAQList] = useState<any>(fields?.faqs || []);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openFAQIndexByCategory, setOpenFAQIndexByCategory] = useState<
    Record<number, number | null>
  >({ 0: 0 });
  const router = useRouter();

  const getPlainTextAnswerForSearch = (richTextAnswer: string) =>
    (richTextAnswer || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

  const matchesFAQSearch = (faq: { question?: string; answer?: string }, keyword: string) => {
    const needle = keyword.toLowerCase().trim();
    if (!needle) return false;

    const question = (faq.question || '').toLowerCase();
    const answer = getPlainTextAnswerForSearch(faq.answer || '').toLowerCase();

    return question.includes(needle) || answer.includes(needle);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSelectedCategory('');
    setShowDropdown(false);

    const searchValue = search.trim();
    if (!searchValue) {
      setSelectedFAQ([]);
      return;
    }

    const allFAQs = getAllFAQs();
    const filtered = allFAQs.filter((faq: any) => matchesFAQSearch(faq, searchValue));

    // Flat FAQ[] for result count; UI groups by tagName when rendering
    setSelectedFAQ(filtered);
    setOpenFAQIndexByCategory({ 0: 0 });
  };

  const getAllFAQs = () => {
    return fields?.faqs?.flatMap((category: any) =>
      category.items.map((faq: any) => ({
        question: faq.Question.value,
        answer: faq.Answer.value,
        tagName: category.tagName?.value || category?.tagName,
      }))
    );
  };

  /** Group flat search hits by category so one card per tag (e.g. all NewLease together). */
  const groupFAQsByTag = (faqs: any[]) => {
    const categoryOrder = (fields?.faqs || []).map((category: any) =>
      String(category.tagName?.value || category?.tagName || '')
        .toLowerCase()
        .trim()
    );

    const groupsMap = new Map<string, { tagName: string; items: any[] }>();

    faqs.forEach((faq) => {
      const tagName = faq?.tagName?.value || faq?.tagName || '';
      const key = String(tagName).toLowerCase().trim();
      if (!groupsMap.has(key)) {
        groupsMap.set(key, { tagName, items: [] });
      }
      groupsMap.get(key)!.items.push(faq);
    });

    const ordered: { tagName: string; items: any[] }[] = [];
    categoryOrder.forEach((key: string) => {
      const group = groupsMap.get(key);
      if (group) {
        ordered.push(group);
        groupsMap.delete(key);
      }
    });
    groupsMap.forEach((group) => ordered.push(group));

    return ordered;
  };

  const filterFAQs = (value?: string) => {
    const searchValue = value ?? search;

    if (!searchValue.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const allFAQs = getAllFAQs();

    const filtered = allFAQs.filter((faq: any) => matchesFAQSearch(faq, searchValue));

    setSuggestions(filtered.slice(0, 5));
    setShowDropdown(true);
  };

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const toggleCategoryList = () => {
    setShowCategoryList((prev) => !prev);
  };

  const resetFAQs = () => {
    setFAQList(fields?.faqs || []);
    setSelectedFAQ([]);
    setSelectedCategory('');
    setSearch('');
    setSuggestions([]);
    setShowDropdown(false);

    // Use asPath so catch-all Sitecore routes stay on this page (pathname is /[[...path]])
    const pathWithoutQuery = router.asPath.split('?')[0];
    router.replace(pathWithoutQuery, undefined, { shallow: true });
  };

  const handleCategoryClick = (item: any) => {
    setSelectedCategory(item?.tagName?.value?.toLowerCase() || item?.tagName?.toLowerCase());
    setSelectedFAQ([]);
    setSearch('');
    setSuggestions([]);
    setShowDropdown(false);
    setShowCategoryList(false);

    const type = item?.tagName?.value?.toLowerCase() || item?.tagName?.toLowerCase();
    const pathWithoutQuery = router.asPath.split('?')[0];
    router.replace(`${pathWithoutQuery}?type=${encodeURIComponent(type)}`, undefined, {
      shallow: true,
    });
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!selectedCategory) {
      setFAQList(fields?.faqs || []);
      return;
    }

    const filtered = fields?.faqs?.filter(
      (faq: any) =>
        faq.tagName?.value?.toLowerCase() == selectedCategory ||
        (typeof faq?.tagName === 'string' && selectedCategory == faq?.tagName?.toLowerCase())
    );
    setFAQList(filtered);
  }, [selectedCategory, fields?.faqs]);

  useEffect(() => {
    const { type: categoryParam } = router.query;
    if (categoryParam) {
      setSelectedCategory(categoryParam as string);
    }
  }, [router.query]);

  const hasNoSearchResults =
    selectedFAQ.length === 0 && search.trim() !== '' && suggestions.length === 0;

  return (
    <section className="FAQPage bg-lilac-100 py-8">
      <div className="container-sm">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <div className="p-4 bg-white-pure border border-solid border-lilac-300 rounded-xl">
              <h4 className="text-4 lg:text-heading-3 font-normal text-navy-500 pb-2.5">Search</h4>
              <form onSubmit={handleSearchSubmit} noValidate className="form-group relative">
                <Input
                  placeholder={'Search here'}
                  value={search}
                  showClearButton={false}
                  className="pe-14"
                  name="search"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    setSelectedFAQ([]);
                    filterFAQs(value);
                  }}
                  containerClassName="mt-0! -mb-2!"
                />
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-10 md:mt-6 w-full md:px-4">
                    <div className="px-4 py-3 bg-white-pure border border-lilac-300 rounded-xl shadow-lg max-h-60 overflow-auto no-scrollbar">
                      <p className="text-body font-normal text-navy-500 pb-2.5">Keywords</p>
                      <ul className="flex flex-col gap-2">
                        {suggestions.map((item, index) => (
                          <li
                            key={index}
                            className="p-2 text-body font-light text-navy-500 transition-default rounded-xl cursor-pointer hover:bg-lilac-100"
                            onClick={() => {
                              setSearch(item.question);
                              setShowDropdown(false);
                              setSelectedCategory(
                                item.tagName?.value?.toLowerCase() || item.tagName?.toLowerCase()
                              );
                              setSelectedFAQ([item]);
                            }}
                          >
                            {highlightText(item.question, search)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <button type="submit" className="absolute end-4 top-1/2 -translate-y-1/2">
                  <SearchIcon
                    className={`cursor-pointer transition-default ${
                      isSearchFocused || search.length > 0 ? 'text-navy-500' : 'text-lilac-500'
                    }`}
                  />
                </button>
              </form>
            </div>
          </div>
          {(selectedFAQ.length > 0 || selectedCategory || hasNoSearchResults) && (
            <div className="flex gap-5 flex-col md:flex-row justify-between items-center">
              <button className="btn btn-secondary md:btn-sm" onClick={resetFAQs}>
                {hasNoSearchResults ? (
                  'Clear Search'
                ) : (
                  <>
                    <ArrowLeft />
                    Back
                  </>
                )}
              </button>
              {(selectedFAQ.length > 0 || hasNoSearchResults) && (
                <span className="text-heading-3 font-normal">
                  {hasNoSearchResults ? 0 : selectedFAQ.length} result
                  {(hasNoSearchResults ? 0 : selectedFAQ.length) === 1 ? '' : 's'} found
                </span>
              )}
            </div>
          )}
          {hasNoSearchResults && (
            <div className="w-full">
              <div className="p-4 bg-white-pure border border-solid border-lilac-300 rounded-xl">
                <Image
                  className="mx-auto"
                  src={'/assets/svg/open-envelop.svg'}
                  alt="No Result Found"
                  width={175}
                  height={125}
                />
                <p className="text-body font-medium text-navy-500 pb-2.5">
                  No results found for: <span className="font-light">&quot;{search}&quot;</span>
                </p>
                <p className="text-body font-medium text-navy-500 pb-2.5">Search help</p>
                <ul className="list-disc ps-4 font-light text-navy-500">
                  <li>Check the spelling</li>
                  <li>Use different keywords</li>
                  <li>
                    Need help finding something? Call{' '}
                    <Link
                      href={'tel:8009933'}
                      className="text-navy-500 hover:text-lilac-500 underline"
                    >
                      800 9933
                    </Link>{' '}
                    or{' '}
                    <Link
                      href={'mailto:customercare@dubairesidential.ae'}
                      className="text-navy-500 hover:text-lilac-500 underline"
                    >
                      email us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {!hasNoSearchResults && (
            <div className="flex gap-5">
              <div className="w-auto shrink-0 fixed md:static z-999 md:z-0 start-6 lg:start-12 bottom-12">
                <div
                  className={`bg-black/50  fixed inset-0 -z-1 transition-default
                ${
                  showCategoryList
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                }`}
                ></div>
                <div
                  className={`p-4 bg-white-pure border border-solid border-lilac-300 rounded-xl transition-default overflow-hidden
                ${
                  showCategoryList
                    ? 'max-w-full max-h-full opacity-100 visible'
                    : 'max-w-0 max-h-0 md:max-w-full md:max-h-full opacity-0 invisible pointer-events-none md:opacity-100 md:visible md:pointer-events-auto'
                }`}
                >
                  <h4 className="text-4 lg:text-heading-3 font-normal text-navy-500 pb-2.5 whitespace-nowrap">
                    Quick links
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {fields?.faqs?.map((item: any, index: number) => (
                      <li
                        key={index}
                        className={`flex items-center text-body-sm font-bold gap-2 px-2 py-3 uppercase whitespace-nowrap transition-default rounded-xl cursor-pointer ${
                          selectedCategory == item?.tagName?.value?.toLowerCase() ||
                          (typeof item?.tagName === 'string' &&
                            selectedCategory == item?.tagName?.toLowerCase())
                            ? 'bg-lilac-500 text-white-pure'
                            : 'bg-white-pure text-navy-500 hover:bg-lilac-100'
                        }`}
                        onClick={() => {
                          handleCategoryClick(item);
                        }}
                      >
                        <CustomRichText field={item.faqIcon} />
                        {item.tagName?.value || item.tagName}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={toggleCategoryList}
                  type="button"
                  className={`mt-5 md:hidden btn ${
                    showCategoryList ? 'btn-secondary' : 'btn-primary'
                  } w-15 h-15 p-0 flex justify-center items-center`}
                >
                  {showCategoryList ? (
                    <CrossIcon className="size-7!" />
                  ) : (
                    <CategoryIcon className="size-7!" />
                  )}
                </button>
              </div>
              <div className="grow flex flex-col gap-5">
                {selectedFAQ.length > 0
                  ? groupFAQsByTag(selectedFAQ).map((group, categoryIndex) => (
                      <div
                        key={`${group.tagName}-${categoryIndex}`}
                        className="p-4 bg-white-pure border border-solid border-lilac-300 rounded-xl"
                      >
                        <h4 className="text-4 lg:text-heading-3 font-normal text-navy-500 pb-2.5">
                          {group.tagName}
                        </h4>
                        {group.items.map((faq: any, index: number) => (
                          <Accordion
                            key={`${faq.question}-${index}`}
                            title={{ value: faq.question }}
                            // eslint-disable-next-line react/no-children-prop
                            children={{ value: faq.answer }}
                            version={2}
                            isLast={index === group.items.length - 1}
                            isOpen={openFAQIndexByCategory[categoryIndex] === index}
                            onToggle={() =>
                              setOpenFAQIndexByCategory((prev) => ({
                                ...prev,
                                [categoryIndex]: prev[categoryIndex] === index ? null : index,
                              }))
                            }
                          />
                        ))}
                      </div>
                    ))
                  : FAQList?.map((item: any, categoryIndex: number) => (
                      <div
                        key={categoryIndex}
                        className="p-4 bg-white-pure border border-solid border-lilac-300 rounded-xl"
                      >
                        <h4 className="text-4 lg:text-heading-3 font-normal text-navy-500 pb-2.5">
                          {item?.tagName?.value || item?.tagName}
                        </h4>
                        {item?.items?.map((faq: any, index: number) => (
                          <Accordion
                            key={index}
                            title={faq.Question}
                            // eslint-disable-next-line react/no-children-prop
                            children={faq.Answer}
                            version={2}
                            isLast={index == item?.items.length - 1}
                            isOpen={openFAQIndexByCategory[categoryIndex] === index}
                            onToggle={() =>
                              setOpenFAQIndexByCategory((prev) => ({
                                ...prev,
                                [categoryIndex]: prev[categoryIndex] === index ? null : index,
                              }))
                            }
                          />
                        ))}
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
