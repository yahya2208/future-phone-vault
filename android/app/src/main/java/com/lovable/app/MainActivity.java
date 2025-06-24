package com.lovable.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.view.MotionEvent;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // تهيئة WebView
        WebView webView = (WebView) this.getBridge().getWebView();
        
        // تعطيل شريط التمرير
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        
        // تمكين التمرير السلس
        webView.setScrollBarStyle(WebView.SCROLLBARS_INSIDE_OVERLAY);
        
        // تعطيل التكبير/التصغير
        webView.getSettings().setBuiltInZoomControls(false);
        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setSupportZoom(false);
        
        // تحسين الأداء
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
    }
}
