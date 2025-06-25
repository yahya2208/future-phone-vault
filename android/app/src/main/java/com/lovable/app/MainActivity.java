
package com.lovable.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.view.MotionEvent;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // تهيئة WebView
        WebView webView = (WebView) this.getBridge().getWebView();
        
        // إعدادات WebView المحسنة
        WebSettings webSettings = webView.getSettings();
        
        // تعطيل شريط التمرير
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        
        // تمكين التمرير السلس
        webView.setScrollBarStyle(WebView.SCROLLBARS_INSIDE_OVERLAY);
        
        // تعطيل التكبير/التصغير بشكل كامل
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);
        
        // منع التكبير بالنقر المزدوج
        webSettings.setUseWideViewPort(false);
        webSettings.setLoadWithOverviewMode(false);
        
        // إعدادات إضافية لمنع التكبير
        webSettings.setTextZoom(100);
        webView.setInitialScale(100);
        
        // تحسين الأداء
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // منع التمرير الأفقي
        webView.setHorizontalScrollBarEnabled(false);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        
        // إعدادات اللمس المحسنة
        webView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                // السماح بالتمرير العمودي فقط
                if (event.getPointerCount() > 1) {
                    // منع التكبير بالقرص
                    return true;
                }
                return false;
            }
        });
    }
}
