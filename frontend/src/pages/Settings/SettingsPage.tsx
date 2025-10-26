import { useState } from 'react';
import { Save, Bell, Database, Shield, Globe, User } from 'lucide-react';
import { showToast } from '../../components/common/Toaster';
import { GoogleReviewsSearch } from '../../components/GoogleReviews/GoogleReviewsSearch';


const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNewReviews: true,
      alertLowRatings: true,
      weeklySummary: false,
      instantAlerts: true,
    },
    api: {
      hostawayEnabled: true,
      cacheTimeout: 3600,
      autoRefresh: true,
    },
    display: {
      reviewsPerPage: 25,
      defaultSort: 'date',
      showCategories: true,
    },
    security: {
      requireApproval: true,
      autoApproveHighRatings: false,
      minRatingForAutoApprove: 4.5,
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    showToast('Settings saved successfully!', 'success');
  };

  const updateSetting = (section: string, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your review dashboard preferences
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Email notifications for new reviews</span>
                <p className="text-sm text-gray-500">Get notified when new reviews arrive</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailNewReviews}
                onChange={(e) => updateSetting('notifications', 'emailNewReviews', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Alert for low ratings</span>
                <p className="text-sm text-gray-500">Immediate notification for ratings below 3 stars</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.alertLowRatings}
                onChange={(e) => updateSetting('notifications', 'alertLowRatings', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Weekly summary</span>
                <p className="text-sm text-gray-500">Receive weekly review statistics</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.weeklySummary}
                onChange={(e) => updateSetting('notifications', 'weeklySummary', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Instant alerts</span>
                <p className="text-sm text-gray-500">Real-time notifications for urgent issues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.instantAlerts}
                onChange={(e) => updateSetting('notifications', 'instantAlerts', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Hostaway API Integration</span>
                <p className="text-sm text-gray-500">Enable/disable Hostaway review sync</p>
              </div>
              <input
                type="checkbox"
                checked={settings.api.hostawayEnabled}
                onChange={(e) => updateSetting('api', 'hostawayEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Timeout (seconds)
              </label>
              <select
                value={settings.api.cacheTimeout}
                onChange={(e) => updateSetting('api', 'cacheTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={900}>15 minutes</option>
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 hour</option>
                <option value={7200}>2 hours</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Auto-refresh data</span>
                <p className="text-sm text-gray-500">Automatically refresh reviews every 5 minutes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.api.autoRefresh}
                onChange={(e) => updateSetting('api', 'autoRefresh', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Display Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviews per page
              </label>
              <select
                value={settings.display.reviewsPerPage}
                onChange={(e) => updateSetting('display', 'reviewsPerPage', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 reviews</option>
                <option value={25}>25 reviews</option>
                <option value={50}>50 reviews</option>
                <option value={100}>100 reviews</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default sort order
              </label>
              <select
                value={settings.display.defaultSort}
                onChange={(e) => updateSetting('display', 'defaultSort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Newest first</option>
                <option value="rating">Highest rating</option>
                <option value="property">Property name</option>
                <option value="status">Approval status</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Show category ratings</span>
                <p className="text-sm text-gray-500">Display detailed category scores</p>
              </div>
              <input
                type="checkbox"
                checked={settings.display.showCategories}
                onChange={(e) => updateSetting('display', 'showCategories', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Security & Approval</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Require manual approval</span>
                <p className="text-sm text-gray-500">All reviews need manager approval</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.requireApproval}
                onChange={(e) => updateSetting('security', 'requireApproval', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-gray-700">Auto-approve high ratings</span>
                <p className="text-sm text-gray-500">Automatically approve 4.5+ star reviews</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.autoApproveHighRatings}
                onChange={(e) => updateSetting('security', 'autoApproveHighRatings', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            {settings.security.autoApproveHighRatings && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum rating for auto-approval
                </label>
                <select
                  value={settings.security.minRatingForAutoApprove}
                  onChange={(e) => updateSetting('security', 'minRatingForAutoApprove', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={4.0}>4.0 stars</option>
                  <option value={4.5}>4.5 stars</option>
                  <option value={5.0}>5.0 stars only</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Google Reviews Integration</h3>
        </div>   
        <GoogleReviewsSearch />
      </div>    
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Version:</span>
            <span className="ml-2 text-gray-600">v1.0.0</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="ml-2 text-gray-600">Oct 26, 2024</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">API Status:</span>
            <span className="ml-2 text-green-600">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;