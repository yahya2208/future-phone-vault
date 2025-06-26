
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const InviteFriendsButton = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleInviteFriends = async () => {
    const shareText = language === 'ar' 
      ? 'تحقق من تطبيق غزة سايفر - النظام الأكثر أماناً وموثوقية لتوثيق معاملات الهواتف المحمولة'
      : 'Check out Ghaza Saver - The most secure and reliable mobile phone transaction documentation system';
    
    const shareUrl = 'https://94dee515-c3a3-4ac9-b373-5bd09d19d8a1.lovableproject.com';

    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'ar' ? 'غزة سايفر' : 'Ghaza Saver',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: language === 'ar' ? 'تم النسخ' : 'Copied',
          description: language === 'ar' ? 'تم نسخ رابط الدعوة إلى الحافظة' : 'Invitation link copied to clipboard',
        });
      } catch (error) {
        console.log('Error copying to clipboard:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'فشل في نسخ الرابط' : 'Failed to copy link',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button
      onClick={handleInviteFriends}
      variant="outline"
      className="flex items-center gap-2 w-full md:w-auto"
    >
      <Share2 size={16} />
      {language === 'ar' ? 'دعوة الأصدقاء' : 'Invite Friends'}
    </Button>
  );
};

export default InviteFriendsButton;
