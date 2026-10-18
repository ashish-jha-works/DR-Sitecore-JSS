import Tabs from 'src/common/Tabx';

export default function CommunityPage() {
  return (
    <section>
      <Tabs
        tabs={[
          {
            id: 1,
            label: 'MY COMMUNITY',
            content: <h1>Tab Body 1</h1>,
          },
          {
            id: 2,
            label: 'COMMUNITY UPDATES',
            content: <h1>Tab Body 2</h1>,
          },
          {
            id: 3,
            label: 'UPCOMING EVENTS',
            content: <h1>Tab Body 3</h1>,
          },
          {
            id: 4,
            label: 'BOOKING AMENITIES',
            content: <h1>Tab Body 4</h1>,
          },
        ]}
      />
    </section>
  );
}
