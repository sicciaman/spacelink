import FAQItem from './FAQItem';

const faqs = [
  {
    question: "What is SpaceLink Prime?",
    answer: "SpaceLink Prime is our premium subscription service that gives you access to exclusive benefits like bundle pricing (save up to 30%), priority booking slots, and the ability to schedule posts up to 30 days in advance."
  },
  {
    question: "How much does Prime cost?",
    answer: "SpaceLink Prime costs €48 per month. You can cancel anytime, and your benefits will continue until the end of your billing period."
  },
  {
    question: "What are the benefits of Prime?",
    answer: "Prime members get access to bundle packages with up to 30% savings, can choose their preferred posting times, book up to 30 days in advance (vs. 2 days for standard users), get priority during high-demand periods, and receive priority support."
  },
  {
    question: "Can I still post without Prime?",
    answer: "Yes! Standard users can still purchase single posts and book up to 2 days in advance. However, time slots will be automatically assigned to the first available slot of the day."
  },
  {
    question: "Where do I need to book my posts?",
    answer: "Use the calendar regarding the channel in which you want to post. Prime members can choose specific time slots, while standard users get the first available slot."
  },
  {
    question: "How many deals can I post for a single day?",
    answer: "You can book maximum 2 deals per day. This ensures that everyone gets the right space in the channels!"
  },
  {
    question: "How do I know if my post is confirmed?",
    answer: "If you book on the calendar, your post will be automatically scheduled for the time you chose (Italian local time). If there are any issues, you'll be notified directly through email!"
  },
  {
    question: "How often can I repost a deal?",
    answer: "You must wait at least 72 hours (3 days) before reposting the same deal."
  },
  {
    question: "What happens if I need to cancel a booking?",
    answer: "You can cancel a booking up to 24 hours before the scheduled time. The post slot will be returned to your package."
  },
  {
    question: "How long are packages valid for?",
    answer: "Packages are valid for 60 days from the purchase date. Make sure to use your posts within this timeframe!"
  }
];

export default function FAQSection() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}