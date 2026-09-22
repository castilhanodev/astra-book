package com.astrabook.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // guarda se o leitor pediu tela cheia
    static boolean imm = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // registra o plugin do Astra (tela cheia e compartilhar) antes de abrir o site
        registerPlugin(AstraPlugin.class);
        super.onCreate(savedInstanceState);
    }

    // NAO usar onWindowFocusChanged aqui: quando aparece uma caixa do sistema
    // (permissao de notificacao) ou a pessoa puxa a barra de cima, o foco vai e volta
    // e o app fica escondendo/mostrando as barras em loop, piscando a tela inteira.
    @Override
    public void onResume() {
        super.onResume();
        getWindow().getDecorView().postDelayed(this::applyImm, 250);
    }

    // esconde ou mostra as barras do celular
    void applyImm() {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (imm) {
            c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            c.hide(WindowInsetsCompat.Type.systemBars());
        } else {
            c.show(WindowInsetsCompat.Type.systemBars());
        }
    }
}
